"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ProjectStatus, StudioProject } from "@/lib/studio-data";

const LOCAL_WORKSPACE_META_KEY = "texcraft.local-workspace-meta";
const INTERNAL_FOLDER = ".texcraft-studio";
const INTERNAL_INDEX_FILE = "workspace.json";
const PROJECTS_ROOT = "projects";
const PROJECT_MANIFEST_FILE = "project.json";

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: (options?: {
    id?: string;
    mode?: "read" | "readwrite";
  }) => Promise<PermissionedDirectoryHandle>;
};

type FilePermissionDescriptor = {
  mode?: "read" | "readwrite";
};

type FilePermissionState = "granted" | "denied" | "prompt";

type PermissionedDirectoryHandle = FileSystemDirectoryHandle & {
  queryPermission: (
    descriptor?: FilePermissionDescriptor,
  ) => Promise<FilePermissionState>;
  requestPermission: (
    descriptor?: FilePermissionDescriptor,
  ) => Promise<FilePermissionState>;
};

export type SavedProjectSummary = {
  id: string;
  name: string;
  category: string;
  status: ProjectStatus;
  updatedAt: string;
  progress: number;
  savedAt: string;
};

export type WorkspaceFolderMeta = {
  name: string;
  connectedAt: string;
  savedProjects: SavedProjectSummary[];
};

type WorkspaceIndex = {
  version: 1;
  savedAt: string;
  projects: SavedProjectSummary[];
};

type StoredProjectManifest = {
  version: 1;
  savedAt: string;
  project: StudioProject;
};

type LocalWorkspaceContextValue = {
  supported: boolean;
  isConnected: boolean;
  folderMeta: WorkspaceFolderMeta | null;
  savedProjects: SavedProjectSummary[];
  error: string | null;
  connectFolder: () => Promise<void>;
  disconnectFolder: () => void;
  loadProject: (projectId: string) => Promise<StudioProject | null>;
  saveProject: (project: StudioProject) => Promise<void>;
  clearError: () => void;
};

const LocalWorkspaceContext = createContext<LocalWorkspaceContextValue | null>(null);

function cloneProject(project: StudioProject): StudioProject {
  return JSON.parse(JSON.stringify(project)) as StudioProject;
}

function readStoredMeta() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(LOCAL_WORKSPACE_META_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as WorkspaceFolderMeta;
  } catch {
    window.localStorage.removeItem(LOCAL_WORKSPACE_META_KEY);
    return null;
  }
}

function writeStoredMeta(meta: WorkspaceFolderMeta) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_WORKSPACE_META_KEY, JSON.stringify(meta));
}

async function ensureDirectory(
  root: FileSystemDirectoryHandle,
  segments: string[],
  create = false,
) {
  let current = root;

  for (const segment of segments.filter(Boolean)) {
    current = await current.getDirectoryHandle(segment, { create });
  }

  return current;
}

async function readTextFile(root: FileSystemDirectoryHandle, relativePath: string) {
  const segments = relativePath.split("/").filter(Boolean);
  const filename = segments.pop();

  if (!filename) {
    return null;
  }

  try {
    const directory = await ensureDirectory(root, segments, false);
    const handle = await directory.getFileHandle(filename);
    const file = await handle.getFile();
    return await file.text();
  } catch {
    return null;
  }
}

async function writeTextFile(
  root: FileSystemDirectoryHandle,
  relativePath: string,
  content: string,
) {
  const segments = relativePath.split("/").filter(Boolean);
  const filename = segments.pop();

  if (!filename) {
    return;
  }

  const directory = await ensureDirectory(root, segments, true);
  const handle = await directory.getFileHandle(filename, { create: true });
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}

function buildSummary(project: StudioProject, savedAt: string): SavedProjectSummary {
  return {
    id: project.id,
    name: project.name,
    category: project.category,
    status: project.status,
    updatedAt: project.updatedAt,
    progress: project.progress,
    savedAt,
  };
}

async function readWorkspaceIndex(root: FileSystemDirectoryHandle) {
  const raw = await readTextFile(root, `${INTERNAL_FOLDER}/${INTERNAL_INDEX_FILE}`);

  if (!raw) {
    return [] as SavedProjectSummary[];
  }

  try {
    const parsed = JSON.parse(raw) as WorkspaceIndex;
    return Array.isArray(parsed.projects) ? parsed.projects : [];
  } catch {
    return [];
  }
}

async function writeWorkspaceIndex(
  root: FileSystemDirectoryHandle,
  projects: SavedProjectSummary[],
) {
  const payload: WorkspaceIndex = {
    version: 1,
    savedAt: new Date().toISOString(),
    projects,
  };

  await writeTextFile(
    root,
    `${INTERNAL_FOLDER}/${INTERNAL_INDEX_FILE}`,
    JSON.stringify(payload, null, 2),
  );
}

async function saveProjectToFolder(
  root: FileSystemDirectoryHandle,
  project: StudioProject,
) {
  const savedAt = new Date().toISOString();
  const projectCopy = cloneProject(project);
  const projectRoot = `${PROJECTS_ROOT}/${projectCopy.id}`;

  for (const file of projectCopy.files) {
    await writeTextFile(root, `${projectRoot}/${file.path}`, file.content);
  }

  const manifest: StoredProjectManifest = {
    version: 1,
    savedAt,
    project: projectCopy,
  };

  await writeTextFile(
    root,
    `${projectRoot}/${PROJECT_MANIFEST_FILE}`,
    JSON.stringify(manifest, null, 2),
  );

  const currentIndex = await readWorkspaceIndex(root);
  const nextSummary = buildSummary(projectCopy, savedAt);
  const nextIndex = [
    nextSummary,
    ...currentIndex.filter((item) => item.id !== projectCopy.id),
  ];

  await writeWorkspaceIndex(root, nextIndex);

  return nextIndex;
}

async function loadProjectFromFolder(
  root: FileSystemDirectoryHandle,
  projectId: string,
) {
  const manifestPath = `${PROJECTS_ROOT}/${projectId}/${PROJECT_MANIFEST_FILE}`;
  const rawManifest = await readTextFile(root, manifestPath);

  if (!rawManifest) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawManifest) as StoredProjectManifest;
    const project = cloneProject(parsed.project);

    for (const file of project.files) {
      const diskContent = await readTextFile(
        root,
        `${PROJECTS_ROOT}/${projectId}/${file.path}`,
      );

      if (diskContent !== null) {
        file.content = diskContent;
      }
    }

    return project;
  } catch {
    return null;
  }
}

async function requestFolderPermission(handle: PermissionedDirectoryHandle) {
  const descriptor: FilePermissionDescriptor = { mode: "readwrite" };
  const current = await handle.queryPermission(descriptor);

  if (current === "granted") {
    return true;
  }

  if (current === "prompt") {
    const next = await handle.requestPermission(descriptor);
    return next === "granted";
  }

  return false;
}

export function LocalWorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleRef = useRef<FileSystemDirectoryHandle | null>(null);
  const [folderMeta, setFolderMeta] = useState<WorkspaceFolderMeta | null>(null);
  const [supported, setSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "showDirectoryPicker" in window);
    setFolderMeta(readStoredMeta());
  }, []);

  const updateFolderMeta = (meta: WorkspaceFolderMeta) => {
    setFolderMeta(meta);
    writeStoredMeta(meta);
  };

  const connectFolder = async () => {
    const pickerWindow = window as DirectoryPickerWindow;

    if (!pickerWindow.showDirectoryPicker) {
      setError("This browser does not support workspace folder access.");
      return;
    }

    try {
      const handle = await pickerWindow.showDirectoryPicker({
        id: "texcraft-local-workspace",
        mode: "readwrite",
      });
      const granted = await requestFolderPermission(handle);

      if (!granted) {
        setError("Folder access permission is required to save into the selected workspace folder.");
        return;
      }

      handleRef.current = handle;
      setIsConnected(true);
      setError(null);

      const savedProjects = await readWorkspaceIndex(handle);
      updateFolderMeta({
        name: handle.name,
        connectedAt: new Date().toISOString(),
        savedProjects,
      });
    } catch (nextError) {
      if (nextError instanceof DOMException && nextError.name === "AbortError") {
        return;
      }

      setError("Could not connect the selected folder.");
    }
  };

  const disconnectFolder = () => {
    handleRef.current = null;
    setIsConnected(false);
  };

  const saveProject = async (project: StudioProject) => {
    const handle = handleRef.current;

    if (!handle) {
      throw new Error("Select a workspace folder before saving.");
    }

    const savedProjects = await saveProjectToFolder(handle, project);
    updateFolderMeta({
      name: handle.name,
      connectedAt: new Date().toISOString(),
      savedProjects,
    });
    setError(null);
  };

  const loadProject = async (projectId: string) => {
    const handle = handleRef.current;

    if (!handle) {
      return null;
    }

    const project = await loadProjectFromFolder(handle, projectId);

    if (!project) {
      return null;
    }

    const savedProjects = await readWorkspaceIndex(handle);
    updateFolderMeta({
      name: handle.name,
      connectedAt: new Date().toISOString(),
      savedProjects,
    });
    setError(null);

    return project;
  };

  return (
    <LocalWorkspaceContext.Provider
      value={{
        supported,
        isConnected,
        folderMeta,
        savedProjects: folderMeta?.savedProjects ?? [],
        error,
        connectFolder,
        disconnectFolder,
        loadProject,
        saveProject,
        clearError: () => setError(null),
      }}
    >
      {children}
    </LocalWorkspaceContext.Provider>
  );
}

export function useLocalWorkspace() {
  const context = useContext(LocalWorkspaceContext);

  if (!context) {
    throw new Error("useLocalWorkspace must be used inside LocalWorkspaceProvider.");
  }

  return context;
}
