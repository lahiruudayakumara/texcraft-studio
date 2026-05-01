import Link from "next/link";
import {
  ArrowRight,
  Layers3,
  Rocket,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import Navbar from "@/components/layout/home/Navbar";
import {
  featureHighlights,
  getDefaultProject,
  marketingStats,
  studioProjects,
  studioTemplates,
} from "@/lib/studio-data";
import { BrandLogo } from "@/components/brand/BrandLogo";

const workflowSteps = [
  {
    title: "Shape the project",
    description: "Start from a paper, thesis, or proposal shell with the right structure already in place.",
    icon: Layers3,
  },
  {
    title: "Write with live context",
    description: "Edit LaTeX, preview the reading experience, and keep structure visible without switching modes.",
    icon: Sparkles,
  },
  {
    title: "Ship review-ready drafts",
    description: "Use the command deck, compile cues, and project health panels to close the loop faster.",
    icon: Rocket,
  },
];

const heroSignals = [
  {
    title: "Live code + preview",
    detail: "Draft source on one side and read the paper on the other.",
    icon: Sparkles,
  },
  {
    title: "Template-first setup",
    detail: "Start from a paper, thesis, or proposal structure immediately.",
    icon: Layers3,
  },
  {
    title: "Local-first projects",
    detail: "Choose a folder from your device, Google Drive sync, or OneDrive sync.",
    icon: Rocket,
  },
];

export function LandingPage() {
  const primaryProject = getDefaultProject();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="gradient-orb left-[-9rem] top-16 h-72 w-72 bg-cyan-300/22" />
      <div className="gradient-orb right-[-6rem] top-64 h-80 w-80 bg-sky-300/16" />
      <div className="gradient-orb bottom-0 left-1/3 h-96 w-96 bg-emerald-200/18" />

      <Navbar />

      <section className="relative mx-auto max-w-7xl px-6 pb-18 pt-16 sm:pt-20 lg:pt-20">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(290px,0.42fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <div className="relative flex justify-center lg:justify-start">
            <div className="glass-panel-strong shape-panel relative w-full max-w-[22rem] overflow-hidden p-6 sm:p-7">
              <div className="absolute -right-8 top-6 h-24 w-24 rounded-full bg-cyan-200/50 blur-3xl" />
              <div className="absolute -left-8 bottom-8 h-20 w-20 rounded-full bg-sky-100/70 blur-3xl" />

              <div className="relative z-10">
                <BrandLogo priority size="hero" className="mx-auto lg:mx-0" />

                <div className="mt-5">
                  <div className="shape-pill inline-flex items-center gap-2 border border-slate-200/80 bg-white/84 px-4 py-2 text-[11px] text-slate-700 shadow-sm backdrop-blur">
                    <Sparkles className="h-4 w-4 text-cyan-600" />
                    Writing workspace with smarter review tools
                  </div>
                  <p className="mt-4 max-w-xs text-[12px] leading-6 text-slate-600">
                    A calmer manuscript workspace for papers, theses, and proposals with folder-based saving and a cleaner drafting flow.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {heroSignals.map((signal) => {
                    const Icon = signal.icon;

                    return (
                      <div key={signal.title} className="shape-soft border border-slate-200/80 bg-white/78 p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="shape-soft flex h-9 w-9 items-center justify-center bg-cyan-100 text-cyan-700">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[12px] font-semibold text-slate-950">{signal.title}</p>
                            <p className="mt-1 text-[11px] leading-5 text-slate-500">{signal.detail}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-5">
              <p className="panel-label">Built for real document work</p>
              <h1 className="max-w-4xl text-[2.55rem] font-semibold tracking-tight text-slate-950 sm:text-5xl xl:text-[4rem]">
                Write in LaTeX with the features your workflow actually needs.
              </h1>
              <p className="max-w-2xl text-[13px] leading-7 text-slate-600 sm:text-[14px]">
                TexCraft Studio turns the starter app into a polished manuscript workspace with a stronger dashboard, a modern editor shell, richer preview context, and smoother motion across the experience.
              </p>
            </div>

            <div className="glass-panel shape-panel-alt relative overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-cyan-100/70 to-transparent" />
              <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="shape-pill border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      {primaryProject.category}
                    </span>
                    <span className="shape-pill bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700">
                      {primaryProject.status}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-slate-950">{primaryProject.name}</h2>
                  <p className="mt-2 max-w-2xl text-[12px] leading-6 text-slate-600">{primaryProject.heroNote}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[16rem]">
                  <div className="shape-soft border border-slate-200 bg-white/88 p-4 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Updated</p>
                    <p className="mt-2 text-[13px] font-semibold text-slate-950">{primaryProject.updatedAt}</p>
                  </div>
                  <div className="shape-soft border border-slate-200 bg-white/88 p-4 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Progress</p>
                    <p className="mt-2 text-[13px] font-semibold text-slate-950">{primaryProject.progress}% ready</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="shape-pill inline-flex items-center justify-center gap-2 bg-slate-950 px-5 py-3 text-[12px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-700"
              >
                Open project hub
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/projects/${primaryProject.id}`}
                className="shape-pill inline-flex items-center justify-center gap-2 border border-slate-200 bg-white/88 px-5 py-3 text-[12px] font-semibold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50"
              >
                Launch live workspace
                <WandSparkles className="h-4 w-4 text-cyan-600" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {marketingStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="glass-panel shape-soft animate-rise p-5 transition duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-xl font-semibold text-slate-950">{stat.value}</p>
                  <p className="mt-2 text-[12px] leading-6 text-slate-600">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-6 py-8 sm:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="panel-label">Feature sweep</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950 sm:text-3xl">
            Familiar writing flow, upgraded product thinking.
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featureHighlights.map((feature, index) => (
            <article
              key={feature.title}
              className="glass-panel shape-soft animate-rise p-6"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-700">{feature.eyebrow}</p>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-4 text-[12px] leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid gap-8 xl:grid-cols-[1fr_.94fr]">
          <div className="glass-panel shape-panel p-6 sm:p-8">
            <p className="panel-label">Templates</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Jump into the right document shape immediately.</h2>
            <div className="mt-8 grid gap-4">
              {studioTemplates.map((template) => (
                <Link
                  key={template.id}
                  href={`/projects/${template.projectId}`}
                  className="shape-panel-alt group relative overflow-hidden border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${template.accent}`} />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{template.title}</h3>
                      <p className="mt-3 max-w-xl text-[12px] leading-6 text-slate-600">{template.description}</p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-700" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-panel shape-panel-alt p-6 sm:p-8">
            <p className="panel-label">Workflow</p>
            <div className="mt-6 space-y-5">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="shape-soft border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="shape-soft flex h-10 w-10 items-center justify-center bg-cyan-100 text-cyan-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Step {index + 1}</p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-950">{step.title}</h3>
                        <p className="mt-3 text-[12px] leading-6 text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="soft-divider my-8" />

            <div className="grid gap-4 sm:grid-cols-3">
              {studioProjects.map((project) => (
                <div key={project.id} className="shape-soft border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-[13px] font-semibold text-slate-950">{project.name}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">{project.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
