"use client";

import Link from "next/link";
import { startTransition, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCode2,
  FolderOpen,
  PencilLine,
  Play,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { useLocalWorkspace } from "@/components/providers/LocalWorkspaceProvider";
import {
  cloneStudioProject,
  type ActivityItem,
  type ProjectFile,
  type StudioProject,
} from "@/lib/studio-data";

type CompileState = "Live synced" | "Compiling";

type PreviewBlockKind = "chapter" | "section" | "subsection" | "paragraph";

type PreviewBlock = {
  kind: PreviewBlockKind;
  label: string;
  level: 1 | 2 | 3 | 4;
  text: string;
  startLine: number;
  endLine: number;
  editable: boolean;
};

type PreviewDocument = {
  title: string;
  author: string;
  hasTitleCommand: boolean;
  hasAuthorCommand: boolean;
  abstractText: string;
  hasAbstract: boolean;
  blocks: PreviewBlock[];
};

const commandDeck = [
  {
    id: "insert-section",
    label: "Add section",
    snippet: String.raw`\section{New Section}
Introduce the next idea here with a concise paragraph that can be expanded later.`,
  },
  {
    id: "insert-figure",
    label: "Add figure",
    snippet: String.raw`\begin{figure}[t]
\centering
\includegraphics[width=\linewidth]{figures/new-figure}
\caption{Explain the key insight shown in the figure.}
\label{fig:new-figure}
\end{figure}`,
  },
  {
    id: "insert-table",
    label: "Add table",
    snippet: String.raw`\begin{table}[t]
\centering
\begin{tabular}{lcc}
\toprule
Metric & Baseline & Ours \\
\midrule
Latency & -- & -- \\
Accuracy & -- & -- \\
\bottomrule
\end{tabular}
\caption{Summarize the comparison clearly.}
\label{tab:results}
\end{table}`,
  },
];

function stripLatex(line: string) {
  return line
    .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?/g, "")
    .replace(/[{}$]/g, "")
    .replace(/\\&/g, "&")
    .replace(/~/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCommandValue(source: string, command: string) {
  const match = source.match(new RegExp(String.raw`\\${command}\{([^}]*)\}`));
  return match?.[1]?.trim() ?? "";
}

function sanitizeInlineValue(value: string) {
  return value.replace(/[{}]/g, "");
}

function replaceInlineCommand(source: string, command: string, value: string) {
  const sanitized = sanitizeInlineValue(value);
  const pattern = new RegExp(String.raw`\\${command}\{[^}]*\}`);

  if (pattern.test(source)) {
    return source.replace(pattern, `\\${command}{${sanitized}}`);
  }

  return source;
}

function replaceLineRange(source: string, startLine: number, endLine: number, replacement: string[]) {
  const lines = source.split("\n");
  const nextLines = replacement.length > 0 ? replacement : [""];
  lines.splice(startLine, endLine - startLine + 1, ...nextLines);
  return lines.join("\n");
}

function replaceAbstract(source: string, value: string) {
  const abstractBlock = `\\begin{abstract}\n${value}\n\\end{abstract}`;
  const abstractPattern = /\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/;

  if (abstractPattern.test(source)) {
    return source.replace(abstractPattern, abstractBlock);
  }

  if (source.includes("\\maketitle")) {
    return source.replace("\\maketitle", `\\maketitle\n\n${abstractBlock}`);
  }

  return `${source.trimEnd()}\n\n${abstractBlock}\n`;
}

function buildPreview(source: string): PreviewDocument {
  const blocks: PreviewBlock[] = [];
  const lines = source.split("\n");
  const title = extractCommandValue(source, "title") || "Untitled document";
  const author = extractCommandValue(source, "author") || "Document workspace";
  const hasTitleCommand = source.includes("\\title{");
  const hasAuthorCommand = source.includes("\\author{");
  const abstractLines: string[] = [];
  const paragraphLines: string[] = [];
  const rawParagraphLines: string[] = [];

  let insideAbstract = false;
  let paragraphStartLine = -1;
  let paragraphEndLine = -1;

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    blocks.push({
      kind: "paragraph",
      label: "Paragraph",
      level: 4,
      text: paragraphLines.join(" "),
      startLine: paragraphStartLine,
      endLine: paragraphEndLine,
      editable: rawParagraphLines.every((line) => !line.includes("\\")),
    });

    paragraphLines.length = 0;
    rawParagraphLines.length = 0;
    paragraphStartLine = -1;
    paragraphEndLine = -1;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("%")) {
      return;
    }

    if (trimmed.startsWith("\\begin{abstract}")) {
      flushParagraph();
      insideAbstract = true;
      return;
    }

    if (trimmed.startsWith("\\end{abstract}")) {
      insideAbstract = false;
      return;
    }

    if (insideAbstract) {
      const cleaned = stripLatex(trimmed);
      if (cleaned.length > 0) {
        abstractLines.push(cleaned);
      }
      return;
    }

    const chapterMatch = trimmed.match(/\\chapter\{([^}]*)\}/);
    if (chapterMatch) {
      flushParagraph();
      blocks.push({
        kind: "chapter",
        label: "Chapter heading",
        level: 1,
        text: chapterMatch[1].trim(),
        startLine: index,
        endLine: index,
        editable: true,
      });
      return;
    }

    const sectionMatch = trimmed.match(/\\section\{([^}]*)\}/);
    if (sectionMatch) {
      flushParagraph();
      blocks.push({
        kind: "section",
        label: "Section heading",
        level: 2,
        text: sectionMatch[1].trim(),
        startLine: index,
        endLine: index,
        editable: true,
      });
      return;
    }

    const subsectionMatch = trimmed.match(/\\subsection\{([^}]*)\}/);
    if (subsectionMatch) {
      flushParagraph();
      blocks.push({
        kind: "subsection",
        label: "Subsection heading",
        level: 3,
        text: subsectionMatch[1].trim(),
        startLine: index,
        endLine: index,
        editable: true,
      });
      return;
    }

    if (trimmed.startsWith("\\")) {
      flushParagraph();
      return;
    }

    if (trimmed.length === 0) {
      flushParagraph();
      return;
    }

    const cleaned = stripLatex(trimmed);
    if (cleaned.length === 0) {
      return;
    }

    if (paragraphLines.length === 0) {
      paragraphStartLine = index;
    }

    paragraphEndLine = index;
    paragraphLines.push(cleaned);
    rawParagraphLines.push(trimmed);
  });

  flushParagraph();

  return {
    title,
    author,
    hasTitleCommand,
    hasAuthorCommand,
    abstractText: abstractLines.join(" "),
    hasAbstract: abstractLines.length > 0,
    blocks,
  };
}

function calculateMetrics(files: ProjectFile[]) {
  const joined = files.map((file) => file.content).join("\n");
  const plainText = stripLatex(joined);
  const words = plainText.length === 0 ? 0 : plainText.split(/\s+/).filter(Boolean).length;
  const citations = (joined.match(/\\cite[a-zA-Z]*\{/g) ?? []).length;
  const sections =
    (joined.match(/\\chapter\{/g) ?? []).length +
    (joined.match(/\\section\{/g) ?? []).length +
    (joined.match(/\\subsection\{/g) ?? []).length;

  return {
    words,
    citations,
    sections,
  };
}

function activityTone(kind: ActivityItem["kind"]) {
  if (kind === "compile") {
    return "bg-cyan-100 text-cyan-700";
  }

  if (kind === "assistant") {
    return "bg-fuchsia-100 text-fuchsia-700";
  }

  if (kind === "review") {
    return "bg-emerald-100 text-emerald-700";
  }

  return "bg-amber-100 text-amber-700";
}

function blockInputClass(disabled = false) {
  return `shape-field mt-3 w-full border px-4 py-3 text-[12px] leading-6 shadow-sm outline-none transition ${
    disabled
      ? "border-slate-200 bg-slate-50 text-slate-400"
      : "border-slate-200 bg-white text-slate-900 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
  }`;
}

export function ProjectWorkspace({ project }: { project: StudioProject }) {
  const {
    supported,
    isConnected,
    folderMeta,
    error,
    clearError,
    connectFolder,
    loadProject,
    saveProject,
  } = useLocalWorkspace();
  const [projectState, setProjectState] = useState(() => cloneStudioProject(project));
  const [activeFileId, setActiveFileId] = useState(project.files[0]?.id ?? "");
  const [compileState, setCompileState] = useState<CompileState>("Live synced");
  const [lastCompiledAt, setLastCompiledAt] = useState("Just now");
  const [storageState, setStorageState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const skipAutosaveRef = useRef(true);
  const latestProjectRef = useRef(projectState);

  const files = projectState.files;
  const activity = projectState.activity;
  const activeFile = files.find((file) => file.id === activeFileId) ?? files[0];
  const preview = activeFile.kind === "tex" ? buildPreview(activeFile.content) : null;
  const metrics = calculateMetrics(files);
  const lineCount = Math.max(1, activeFile.content.split("\n").length);

  useEffect(() => {
    setProjectState(cloneStudioProject(project));
    setActiveFileId(project.files[0]?.id ?? "");
    setStorageState("idle");
    skipAutosaveRef.current = true;
  }, [project]);

  useEffect(() => {
    latestProjectRef.current = projectState;
  }, [projectState]);

  useEffect(() => {
    let cancelled = false;

    if (!isConnected) {
      setStorageState("idle");
      skipAutosaveRef.current = true;
      return;
    }

    setStorageState("saving");

    void loadProject(project.id)
      .then(async (savedProject) => {
        if (cancelled) {
          return;
        }

        if (savedProject) {
          skipAutosaveRef.current = true;
          setProjectState(savedProject);
          setActiveFileId(savedProject.files[0]?.id ?? "");
          setStorageState("saved");
          return;
        }

        await saveProject(latestProjectRef.current);

        if (!cancelled) {
          setStorageState("saved");
          skipAutosaveRef.current = false;
        }
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setStorageState("error");
        skipAutosaveRef.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [isConnected, folderMeta?.connectedAt, loadProject, project.id, saveProject]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      setStorageState("saving");

      void saveProject(projectState)
        .then(() => {
          setStorageState("saved");
        })
        .catch(() => {
          setStorageState("error");
        });
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [projectState, isConnected, saveProject]);

  const updateActiveFile = (updater: (source: string) => string) => {
    setProjectState((current) => ({
      ...current,
      files: current.files.map((file) =>
        file.id === activeFileId
          ? {
              ...file,
              content: updater(file.content),
            }
          : file,
      ),
    }));
    setCompileState("Live synced");
  };

  const prependActivity = (entry: ActivityItem) => {
    setProjectState((current) => ({
      ...current,
      activity: [entry, ...current.activity].slice(0, 6),
    }));
  };

  const handleCompile = () => {
    setCompileState("Compiling");
    prependActivity({
      title: "Preview refresh requested",
      detail: `Refreshing ${activeFile.name} and syncing the rendered reading view.`,
      time: "Now",
      kind: "compile",
    });

    window.setTimeout(() => {
      setCompileState("Live synced");
      setLastCompiledAt("A moment ago");
      prependActivity({
        title: "Preview refresh finished",
        detail: "Split view is back in sync and ready for review.",
        time: "Now",
        kind: "compile",
      });
    }, 900);
  };

  const handleCodeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;

    setProjectState((current) => ({
      ...current,
      files: current.files.map((file) =>
        file.id === activeFileId
          ? {
              ...file,
              content: nextValue,
            }
          : file,
      ),
    }));

    setCompileState("Live synced");
  };

  const handleInsertSnippet = (snippet: string, label: string) => {
    updateActiveFile((source) => `${source.trimEnd()}\n\n${snippet}\n`);
    prependActivity({
      title: `${label} inserted`,
      detail: "A ready-made LaTeX block was added into the code editor from the toolbar.",
      time: "Now",
      kind: "assistant",
    });
  };

  const handlePreviewMetaEdit = (field: "title" | "author" | "abstract", value: string) => {
    if (field === "abstract") {
      updateActiveFile((source) => replaceAbstract(source, value));
      return;
    }

    updateActiveFile((source) => replaceInlineCommand(source, field, value));
  };

  const handlePreviewBlockEdit = (index: number, value: string) => {
    if (!preview) {
      return;
    }

    const block = preview.blocks[index];
    if (!block || !block.editable) {
      return;
    }

    updateActiveFile((source) => {
      if (block.kind === "chapter") {
        return replaceLineRange(source, block.startLine, block.endLine, [
          `\\chapter{${sanitizeInlineValue(value)}}`,
        ]);
      }

      if (block.kind === "section") {
        return replaceLineRange(source, block.startLine, block.endLine, [
          `\\section{${sanitizeInlineValue(value)}}`,
        ]);
      }

      if (block.kind === "subsection") {
        return replaceLineRange(source, block.startLine, block.endLine, [
          `\\subsection{${sanitizeInlineValue(value)}}`,
        ]);
      }

      return replaceLineRange(source, block.startLine, block.endLine, value.split("\n"));
    });
  };

  const handleFolderConnect = () => {
    clearError();
    void connectFolder();
  };

  const handleSaveNow = () => {
    if (!isConnected) {
      handleFolderConnect();
      return;
    }

    clearError();
    setStorageState("saving");

    void saveProject(projectState)
      .then(() => {
        setStorageState("saved");
      })
      .catch(() => {
        setStorageState("error");
      });
  };

  const folderStatusLabel = !supported
    ? "Browser workspace folder access is not supported here."
    : isConnected
      ? storageState === "saving"
        ? "Saving into your chosen workspace folder."
        : storageState === "error"
          ? "Could not write to the selected folder."
          : "Project files live in the connected workspace folder."
      : folderMeta
        ? "Reconnect the same folder to open the saved workspace files again."
        : "Choose a folder once from your computer, Google Drive sync, or OneDrive sync. The project will be saved there instead of a database.";

  const folderStatusTone = !supported
    ? "border-amber-200 bg-amber-50 text-amber-700"
    : storageState === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : isConnected
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-white text-slate-600";

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-3 sm:px-5 lg:px-6">
      <div className="gradient-orb left-[-7rem] top-20 h-72 w-72 bg-cyan-300/25" />
      <div className="gradient-orb right-[-10rem] top-10 h-96 w-96 bg-sky-200/30" />
      <div className="gradient-orb bottom-10 left-1/3 h-80 w-80 bg-amber-200/30" />

      <div className="relative mx-auto max-w-[1720px]">
        <header className="glass-panel-strong shape-panel-alt px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-[12px] font-medium text-slate-600 transition hover:text-slate-950"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to projects
              </Link>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  {projectState.category}
                </p>
                <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-slate-950 sm:text-[26px]">
                  {projectState.name}
                </h1>
                <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-slate-600">
                  {projectState.heroNote}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="shape-pill inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {compileState}
              </div>
              <div className="shape-pill inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600">
                <Clock3 className="h-3.5 w-3.5 text-cyan-600" />
                Updated {lastCompiledAt}
              </div>
              <button
                type="button"
                onClick={handleCompile}
                className="shape-pill inline-flex items-center gap-2 bg-slate-950 px-4 py-1.5 text-[11px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-700"
              >
                <Play className="h-3.5 w-3.5" />
                Refresh preview
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-[0.18em]">Words</span>
              <span className="text-[13px] font-semibold text-slate-950">{metrics.words}</span>
            </div>
            <div className="hidden h-3 w-px bg-slate-300 sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-[0.18em]">Citations</span>
              <span className="text-[13px] font-semibold text-slate-950">{metrics.citations}</span>
            </div>
            <div className="hidden h-3 w-px bg-slate-300 sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-[0.18em]">Sections</span>
              <span className="text-[13px] font-semibold text-slate-950">{metrics.sections}</span>
            </div>
          </div>

          <div className="shape-soft mt-3 border border-slate-200 bg-white/85 px-3 py-2.5">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Workspace folder
                </p>
                <p className="mt-1 truncate text-[12px] font-medium text-slate-950">
                  {folderMeta ? folderMeta.name : "No folder selected yet"}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  {folderStatusLabel}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`shape-pill inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] font-medium ${folderStatusTone}`}
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  {isConnected
                    ? storageState === "saving"
                      ? "Saving"
                      : storageState === "error"
                        ? "Save error"
                        : "Connected"
                    : folderMeta
                      ? "Reconnect needed"
                      : "Choose folder"}
                </span>
                <button
                  type="button"
                  onClick={handleFolderConnect}
                  className="shape-pill inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-slate-950"
                >
                  <FolderOpen className="h-3.5 w-3.5 text-cyan-600" />
                  {folderMeta ? "Choose or reconnect folder" : "Choose workspace folder"}
                </button>
                <button
                  type="button"
                  onClick={handleSaveNow}
                  disabled={!supported}
                  className="shape-pill inline-flex items-center gap-2 bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Save now
                </button>
              </div>
            </div>

            {error && <p className="mt-2 text-[11px] text-rose-600">{error}</p>}
          </div>
        </header>

        <section className="mt-3 grid gap-4 xl:grid-cols-2">
          <article className="glass-panel-strong shape-panel flex min-h-[78vh] flex-col overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                    Code editor
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">
                    Raw LaTeX on the left, live preview on the right.
                  </h2>
                  <p className="mt-2 text-[12px] leading-6 text-slate-600">
                    This is now a true two-pane split screen with lighter styling and quicker edit controls.
                  </p>
                </div>

                <div className="shape-pill inline-flex items-center gap-2 border border-cyan-200 bg-cyan-50 px-4 py-2 text-[12px] font-medium text-cyan-700">
                  <Sparkles className="h-4 w-4" />
                  Split workspace
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {files.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => startTransition(() => setActiveFileId(file.id))}
                    className={`shape-pill px-4 py-2 text-[12px] font-medium transition ${
                      activeFileId === file.id
                        ? "bg-slate-950 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-slate-950"
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {commandDeck.map((command) => (
                  <button
                    key={command.id}
                    type="button"
                    onClick={() => handleInsertSnippet(command.snippet, command.label)}
                    className="shape-pill inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[12px] font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-slate-950"
                  >
                    <WandSparkles className="h-4 w-4 text-cyan-600" />
                    {command.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-slate-950">{activeFile.name}</p>
                <p className="truncate text-xs uppercase tracking-[0.18em] text-slate-500">{activeFile.path}</p>
              </div>
              <div className="shape-pill inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600">
                <FileCode2 className="h-3.5 w-3.5 text-cyan-600" />
                Live code view
              </div>
            </div>

            <div className="editor-grid flex-1 overflow-hidden bg-[#f7fbff]">
              <div className="overflow-hidden border-r border-slate-200 bg-slate-50 px-3 py-4 text-right text-[11px] leading-6 text-slate-400">
                {Array.from({ length: lineCount }).map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>
              <textarea
                value={activeFile.content}
                onChange={handleCodeChange}
                spellCheck={false}
                className="editor-textarea h-full min-h-[56vh] w-full"
              />
            </div>
          </article>

          <article className="glass-panel-strong shape-panel-alt flex min-h-[78vh] flex-col overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                    Preview + UI edit
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">
                    Edit the preview with form controls, not only code.
                  </h2>
                  <p className="mt-2 text-[12px] leading-6 text-slate-600">
                    Title, author, abstract, and plain text blocks can be updated from this panel and written back into the source.
                  </p>
                </div>

                <div className="shape-pill inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-2 text-[12px] font-medium text-amber-700">
                  <PencilLine className="h-4 w-4" />
                  UI editing enabled
                </div>
              </div>
            </div>

            {preview ? (
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    {preview.hasTitleCommand && (
                      <div className="shape-soft border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Document title</p>
                        <input
                          value={preview.title}
                          onChange={(event) => handlePreviewMetaEdit("title", event.target.value)}
                          className={blockInputClass()}
                        />
                      </div>
                    )}
                    {preview.hasAuthorCommand && (
                      <div className="shape-soft border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Author line</p>
                        <input
                          value={preview.author}
                          onChange={(event) => handlePreviewMetaEdit("author", event.target.value)}
                          className={blockInputClass()}
                        />
                      </div>
                    )}
                  </div>

                  {preview.hasAbstract && (
                    <div className="shape-soft border border-slate-200 bg-slate-50/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Abstract</p>
                      <textarea
                        value={preview.abstractText}
                        onChange={(event) => handlePreviewMetaEdit("abstract", event.target.value)}
                        className={`${blockInputClass()} min-h-28 resize-y`}
                      />
                    </div>
                  )}

                  <div className="preview-page shape-panel p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Rendered preview</p>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{preview.title}</h3>
                    <p className="mt-2 text-[12px] text-slate-500">{preview.author}</p>

                    {preview.hasAbstract && (
                      <div className="shape-soft mt-6 bg-slate-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Abstract</p>
                        <p className="mt-3 text-[12px] leading-6 text-slate-700">{preview.abstractText}</p>
                      </div>
                    )}

                    <div className="mt-7 space-y-4">
                      {preview.blocks.map((block, index) => (
                        <div key={`${block.kind}-${index}`}>
                          {block.kind === "chapter" && (
                            <h4 className="text-xl font-semibold text-slate-950">{block.text}</h4>
                          )}
                          {block.kind === "section" && (
                            <h4 className="text-lg font-semibold text-slate-950">{block.text}</h4>
                          )}
                          {block.kind === "subsection" && (
                            <h5 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                              {block.text}
                            </h5>
                          )}
                          {block.kind === "paragraph" && (
                            <p className="text-[12px] leading-6 text-slate-700">{block.text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="shape-panel border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Block editor</p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-950">Edit the preview with UI fields</h3>
                      </div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {preview.blocks.length} blocks
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      {preview.blocks.map((block, index) => (
                        <div key={`${block.kind}-editor-${index}`} className="shape-soft border border-slate-200 bg-slate-50/80 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                {block.label}
                              </p>
                              <p className="mt-1 text-[12px] text-slate-500">
                                {block.editable ? "Edits update the source immediately." : "Contains LaTeX commands, so edit from code to preserve formatting."}
                              </p>
                            </div>
                            <span
                              className={`shape-pill px-3 py-1 text-[11px] font-medium ${
                                block.editable
                                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border border-slate-200 bg-white text-slate-500"
                              }`}
                            >
                              {block.editable ? "Editable here" : "Code only"}
                            </span>
                          </div>

                          {block.kind === "paragraph" ? (
                            <textarea
                              value={block.text}
                              onChange={(event) => handlePreviewBlockEdit(index, event.target.value)}
                              disabled={!block.editable}
                              className={`${blockInputClass(!block.editable)} min-h-28 resize-y`}
                            />
                          ) : (
                            <input
                              value={block.text}
                              onChange={(event) => handlePreviewBlockEdit(index, event.target.value)}
                              disabled={!block.editable}
                              className={blockInputClass(!block.editable)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="shape-panel-alt border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Activity</p>
                      <div className="mt-4 space-y-3">
                        {activity.slice(0, 4).map((item) => (
                          <div key={`${item.title}-${item.time}`} className="shape-soft border border-slate-200 bg-slate-50/80 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[13px] font-medium text-slate-950">{item.title}</p>
                              <span className={`shape-pill px-3 py-1 text-[11px] font-medium ${activityTone(item.kind)}`}>
                                {item.kind}
                              </span>
                            </div>
                            <p className="mt-3 text-[12px] leading-6 text-slate-700">{item.detail}</p>
                            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">{item.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center p-6">
                <div className="shape-panel max-w-md border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Preview editor</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">Structured UI editing is for TeX files.</h3>
                  <p className="mt-3 text-[12px] leading-6 text-slate-600">
                    Bibliography and style files stay editable in the code pane, while the preview-side UI is reserved for document files with headings and readable prose.
                  </p>
                </div>
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
