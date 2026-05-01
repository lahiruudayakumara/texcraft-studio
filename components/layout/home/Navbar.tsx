"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/brand/BrandLogo";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/projects", label: "Projects" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="nav-shell shape-panel mx-auto max-w-7xl px-3 py-2 sm:px-4">
        <div className="flex min-h-[54px] items-center justify-between gap-3">
          <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <BrandLogo priority size="nav" />
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <div className="shape-pill flex items-center gap-1 border border-slate-200/80 bg-white/80 p-1 shadow-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="shape-pill px-3 py-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-950 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/projects"
              className="shape-pill inline-flex items-center gap-2 bg-slate-950 px-4 py-2.5 text-[11px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-700"
            >
              Open workspace
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="md:hidden">
            {navLinks.map((link) => (
              <div key={link.href} className="hidden" />
            ))}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="shape-soft border border-slate-200/80 bg-white/88 p-2 text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="nav-shell shape-panel-alt mx-auto mt-2 max-w-7xl p-3 md:hidden">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shape-soft block border border-transparent px-4 py-3 text-[12px] font-medium text-slate-700 transition hover:border-slate-200 hover:bg-white"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/projects"
            className="shape-pill mt-3 inline-flex w-full items-center justify-center gap-2 bg-slate-950 px-4 py-3 text-[12px] font-semibold text-white shadow-sm"
            onClick={() => setIsOpen(false)}
          >
            Open workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
