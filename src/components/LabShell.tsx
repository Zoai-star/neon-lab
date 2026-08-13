import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const links = [
  { to: "/", label: "Hub" },
  { to: "/robot-lab", label: "Robots" },
  { to: "/dna-lab", label: "DNA" },
  { to: "/chem-lab", label: "Chem" },
] as const;

export function LabShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary neon-text" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-neon-lime">{eyebrow}</p>
          <h1 className="mt-2 text-3xl text-primary neon-text flicker sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{intro}</p>
        </header>
        <div className="grid gap-5">{children}</div>
      </main>
      <footer className="border-t border-border py-6 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Neon Lab · Sector 7 Research Wing
      </footer>
    </div>
  );
}
