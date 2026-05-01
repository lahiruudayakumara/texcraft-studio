import { Eye, FileCode2, FolderOpen, Sparkles } from "lucide-react";

import { BrandLogo } from "@/components/brand/BrandLogo";

type SplashScreenProps = {
  detail?: string;
  message?: string;
};

const splashSignals = [
  {
    label: "Code editor",
    note: "Source tools prepared",
    icon: FileCode2,
  },
  {
    label: "Reading preview",
    note: "Layout engine waking up",
    icon: Eye,
  },
  {
    label: "Local folder",
    note: "Project files stay on disk",
    icon: FolderOpen,
  },
];

export function SplashScreen({
  detail = "Preparing your local workspace, editor, and preview.",
  message = "Opening TexCraft Studio",
}: SplashScreenProps) {
  return (
    <div className="splash-shell">
      <div className="splash-grid" />
      <div className="splash-beam splash-beam-left" />
      <div className="splash-beam splash-beam-right" />
      <div className="splash-orb splash-orb-cyan" />
      <div className="splash-orb splash-orb-sky" />

      <div className="splash-stage">
        <div className="flex justify-center lg:justify-start">
          <div className="shape-pill inline-flex items-center gap-2 border border-slate-200/80 bg-white/84 px-4 py-2 text-[11px] text-slate-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-cyan-600" />
            Local-first writing workspace
          </div>
        </div>

        <div className="splash-layout">
          <div className="splash-visual">
            <div className="splash-ring splash-ring-outer" />
            <div className="splash-ring splash-ring-mid" />
            <div className="splash-ring splash-ring-core" />

            <div className="glass-panel-strong shape-panel splash-logo-panel">
              <div className="splash-logo-wrap">
                <BrandLogo priority size="splash" className="mx-auto" />
              </div>
            </div>
          </div>

          <div className="splash-copy">
            <p className="panel-label">Launching</p>
            <h1 className="mt-4 text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.7rem] lg:text-[3.1rem]">
              {message}
            </h1>
            <p className="mt-4 max-w-2xl text-[13px] leading-7 text-slate-600 sm:text-[14px]">
              {detail}
            </p>

            <div className="splash-loader">
              <div className="splash-loader-bar" />
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {splashSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div key={signal.label} className="glass-panel shape-soft splash-signal">
                    <div className="shape-soft flex h-10 w-10 items-center justify-center bg-cyan-100 text-cyan-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-4 text-[12px] font-semibold text-slate-950">{signal.label}</p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">{signal.note}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-slate-400">
              <span className="splash-dot" />
              <span className="splash-dot splash-dot-delay-1" />
              <span className="splash-dot splash-dot-delay-2" />
              <span className="pl-2">Editor opening</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
