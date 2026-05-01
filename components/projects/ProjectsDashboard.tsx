"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import {
  ArrowRight,
  Clock3,
  Filter,
  FolderCog,
  FolderOpen,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { useLocalWorkspace } from "@/components/providers/LocalWorkspaceProvider";
import { getDefaultProject, studioProjects, studioTemplates } from "@/lib/studio-data";

const filters = ["All", "Drafting", "Review ready", "Active draft"] as const;

type FilterValue = (typeof filters)[number];

export function ProjectsDashboard() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterValue>("All");
  const [isWorkspacePanelOpen, setIsWorkspacePanelOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const featuredProject = getDefaultProject();
  const { supported, isConnected, folderMeta, savedProjects, connectFolder, error, clearError } =
    useLocalWorkspace();
  const savedProjectIds = new Set(savedProjects.map((project) => project.id));
  const folderButtonLabel = folderMeta ? "Workspace folder" : "Storage setup";
  const folderStatusLabel = folderMeta
    ? isConnected
      ? "Connected now"
      : "Reconnect to continue"
    : "Not connected yet";

  const visibleProjects = studioProjects.filter((project) => {
    const matchesQuery =
      deferredQuery.trim().length === 0 ||
      [project.name, project.category, project.summary, project.healthNote]
        .join(" ")
        .toLowerCase()
        .includes(deferredQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || project.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-7">
      <div className="gradient-orb left-[-10rem] top-10 h-80 w-80 bg-cyan-300/20" />
      <div className="gradient-orb right-[-12rem] top-32 h-[28rem] w-[28rem] bg-sky-200/22" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex flex-col items-start gap-1.5 text-slate-950 transition hover:text-cyan-700">
            <BrandLogo size="hub" />
            <p className="pl-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">Project hub</p>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/projects/${featuredProject.id}`}
              className="shape-pill inline-flex items-center gap-2 bg-slate-950 px-4 py-2.5 text-[12px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-700"
            >
              Resume featured workspace
              <ArrowRight className="h-4 w-4 text-cyan-100" />
            </Link>
            <button
              type="button"
              onClick={() => setIsWorkspacePanelOpen(true)}
              className="shape-pill inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:text-slate-950"
            >
              <FolderCog className="h-4 w-4 text-cyan-700" />
              {folderButtonLabel}
            </button>
          </div>
        </div>

        <section className="glass-panel-strong shape-panel mt-7 p-5 sm:p-7">
          <div className="grid gap-6 xl:grid-cols-[1.08fr_.92fr] xl:items-center">
            <div>
              <p className="panel-label">Workspace command center</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Project views that feel like a product, not a file dump.
              </h1>
              <p className="mt-5 max-w-2xl text-[13px] leading-7 text-slate-600">
                Search projects, jump between templates, and keep progress, health, and document status visible before you even open the editor.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <label className="shape-field flex min-w-0 flex-1 items-center gap-3 border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm focus-within:border-cyan-300">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by project, category, or status..."
                    className="w-full bg-transparent text-[12px] outline-none placeholder:text-slate-400"
                  />
                </label>

                <div className="shape-pill flex items-center gap-2 border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-600 shadow-sm">
                  <Filter className="h-4 w-4 text-cyan-700" />
                  {visibleProjects.length} project{visibleProjects.length === 1 ? "" : "s"} visible
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="shape-soft border border-slate-200 bg-white p-5 shadow-sm">
                <div className="metric-chip">
                  <FolderOpen className="h-4 w-4" />
                  Open now
                </div>
                <p className="mt-5 text-2xl font-semibold text-slate-950">{studioProjects.length}</p>
                <p className="mt-2 text-[12px] text-slate-400">Active sample workspaces</p>
              </div>
              <div className="shape-soft border border-slate-200 bg-white p-5 shadow-sm">
                <div className="metric-chip">
                  <Sparkles className="h-4 w-4" />
                  Templates
                </div>
                <p className="mt-5 text-2xl font-semibold text-slate-950">{studioTemplates.length}</p>
                <p className="mt-2 text-[12px] text-slate-400">Document starting points ready</p>
              </div>
              <div className="shape-soft border border-slate-200 bg-white p-5 shadow-sm">
                <div className="metric-chip">
                  <Clock3 className="h-4 w-4" />
                  Latest sync
                </div>
                <p className="mt-5 text-2xl font-semibold text-slate-950">Now</p>
                <p className="mt-2 text-[12px] text-slate-400">The hub mirrors the latest workspace state</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-5 flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`shape-pill px-4 py-2 text-[12px] font-medium transition ${
                    statusFilter === filter
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-slate-950"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid gap-5">
              {visibleProjects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="glass-panel shape-panel-alt group animate-rise block p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-slate-950">{project.name}</h2>
                        <span className="shape-pill border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                          {project.category}
                        </span>
                        <span className="shape-pill bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700">
                          {project.status}
                        </span>
                        {savedProjectIds.has(project.id) && (
                          <span className="shape-pill bg-cyan-100 px-3 py-1 text-[11px] font-medium text-cyan-700">
                            Saved in workspace
                          </span>
                        )}
                      </div>

                      <p className="max-w-3xl text-[12px] leading-6 text-slate-600">{project.summary}</p>
                      <p className="text-[12px] text-slate-500">{project.healthNote}</p>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="inline-flex items-center gap-2 text-[12px] text-slate-500">
                          <Clock3 className="h-4 w-4 text-cyan-700" />
                          Updated {project.updatedAt}
                        </div>
                        <div className="inline-flex items-center gap-2 text-[12px] text-slate-500">
                          <Sparkles className="h-4 w-4 text-cyan-700" />
                          {project.progress}% ready
                        </div>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-cyan-700 transition group-hover:translate-x-1 group-hover:text-slate-950">
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="glass-panel shape-panel p-5">
              <p className="panel-label">Start from a template</p>
              <div className="mt-5 space-y-3">
                {studioTemplates.map((template) => (
                  <Link
                    key={template.id}
                    href={`/projects/${template.projectId}`}
                    className="shape-panel-alt group block border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300"
                  >
                    <div className={`shape-soft mb-3 h-20 bg-gradient-to-br ${template.accent}`} />
                    <p className="text-[13px] font-semibold text-slate-950">{template.title}</p>
                    <p className="mt-2 text-[12px] leading-6 text-slate-500">{template.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-panel shape-panel-alt p-5">
              <p className="panel-label">Quick pulse</p>
              <div className="mt-5 space-y-4">
                {studioProjects.map((project) => (
                  <div key={project.id} className="shape-soft border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[13px] font-medium text-slate-950">{project.name}</p>
                    <p className="mt-1 text-[12px] text-slate-400">{project.updatedAt}</p>
                    <p className="mt-3 text-[12px] leading-6 text-slate-600">{project.healthNote}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {isWorkspacePanelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/12 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close workspace settings"
            className="absolute inset-0"
            onClick={() => setIsWorkspacePanelOpen(false)}
          />

          <aside className="absolute inset-y-3 right-3 z-10 w-[min(100%-1.5rem,26rem)] glass-panel-strong shape-panel flex flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="panel-label">Workspace settings</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">Workspace folder</h2>
                <p className="mt-3 text-[12px] leading-6 text-slate-600">
                  Project data is stored in your selected folder, not in a database. You can choose a folder from your computer, Google Drive for desktop, or a OneDrive sync folder and reconnect it later if browser storage is cleared.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsWorkspacePanelOpen(false)}
                className="shape-soft flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 shape-soft border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="shape-soft flex h-10 w-10 items-center justify-center bg-cyan-100 text-cyan-700">
                  <FolderCog className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-950">
                    {folderMeta ? folderMeta.name : "No folder selected yet"}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {folderStatusLabel}
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    Works with standard folders, Google Drive desktop sync, and Microsoft OneDrive sync folders.
                  </p>
                </div>
              </div>
            </div>

            {error && <p className="mt-4 text-[12px] text-rose-600">{error}</p>}
            {!supported && (
              <p className="mt-4 text-[12px] text-amber-700">
                This browser does not support direct workspace folder access. Use a browser with folder picker support to choose a standard, Google Drive sync, or OneDrive sync folder.
              </p>
            )}

            <div className="mt-auto flex flex-col gap-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  clearError();
                  void connectFolder();
                }}
                className="shape-pill inline-flex items-center justify-center gap-2 bg-slate-950 px-4 py-3 text-[12px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-700"
              >
                <FolderOpen className="h-4 w-4" />
                {folderMeta ? "Choose or reconnect folder" : "Choose workspace folder"}
              </button>

              <button
                type="button"
                onClick={() => setIsWorkspacePanelOpen(false)}
                className="shape-pill inline-flex items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-3 text-[12px] font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Close settings
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
