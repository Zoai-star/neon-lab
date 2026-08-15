import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LabShell } from "@/components/LabShell";
import { Quiz, type QuizQuestion } from "@/components/Quiz";
import { CreaturePreview } from "@/components/CreaturePreview";

export const Route = createFileRoute("/dna-lab")({
  head: () => ({
    meta: [
      { title: "DNA Splicer — Combine Parent Traits | Neon Lab" },
      {
        name: "description",
        content:
          "Choose traits for Parent A and Parent B, splice their DNA to see the offspring's dominant and recessive genes, then take the genetics quiz.",
      },
      { property: "og:title", content: "DNA Splicer — Combine Parent Traits" },
      {
        property: "og:description",
        content: "A hands-on genetics bench: pick alleles, splice, and read the results.",
      },
    ],
  }),
  component: DnaLab,
});

type Trait = {
  key: string;
  label: string;
  dominant: { allele: string; label: string };
  recessive: { allele: string; label: string };
};

const traits: Trait[] = [
  {
    key: "eyes",
    label: "Eye glow",
    dominant: { allele: "E", label: "Cyan glow" },
    recessive: { allele: "e", label: "Dim amber" },
  },
  {
    key: "scales",
    label: "Skin type",
    dominant: { allele: "S", label: "Scaled" },
    recessive: { allele: "s", label: "Smooth" },
  },
  {
    key: "wings",
    label: "Wings",
    dominant: { allele: "W", label: "Winged" },
    recessive: { allele: "w", label: "Wingless" },
  },
  {
    key: "size",
    label: "Size",
    dominant: { allele: "T", label: "Towering" },
    recessive: { allele: "t", label: "Tiny" },
  },
];

type Genotype = "hom-dom" | "het" | "hom-rec";

const genotypeOptions: {
  value: Genotype;
  plain: (t: Trait) => string;
  hint: (t: Trait) => string;
  code: (t: Trait) => string;
}[] = [
  {
    value: "hom-dom",
    plain: (t) => t.dominant.label,
    hint: () => "pure — both genes the same",
    code: (t) => `${t.dominant.allele}${t.dominant.allele}`,
  },
  {
    value: "het",
    plain: (t) => `${t.dominant.label}, carries ${t.recessive.label.toLowerCase()}`,
    hint: () => "mixed — one of each gene",
    code: (t) => `${t.dominant.allele}${t.recessive.allele}`,
  },
  {
    value: "hom-rec",
    plain: (t) => t.recessive.label,
    hint: () => "pure — both genes the same",
    code: (t) => `${t.recessive.allele}${t.recessive.allele}`,
  },
];

function alleles(t: Trait, g: Genotype): [string, string] {
  if (g === "hom-dom") return [t.dominant.allele, t.dominant.allele];
  if (g === "hom-rec") return [t.recessive.allele, t.recessive.allele];
  return [t.dominant.allele, t.recessive.allele];
}

const dnaQuiz: QuizQuestion[] = [
  {
    question: "What does DNA stand for?",
    options: ["Dual Nucleic Acid", "Deoxyribonucleic acid", "Dense Nuclear Array"],
    answer: 1,
    explain: "DNA is deoxyribonucleic acid, a double helix of paired bases.",
  },
  {
    question: "Which base pairs with adenine (A)?",
    options: ["Guanine", "Cytosine", "Thymine"],
    answer: 2,
    explain: "A pairs with T, and C pairs with G — the base-pairing rule.",
  },
  {
    question: "An organism with one dominant and one recessive allele is...",
    options: ["Heterozygous", "Homozygous", "Haploid"],
    answer: 0,
    explain: "Two different alleles = heterozygous. The dominant one shows.",
  },
  {
    question: "Why can a recessive trait skip a generation?",
    options: [
      "It is hidden whenever a dominant allele is present",
      "It mutates every generation",
      "Recessive genes are destroyed at birth",
    ],
    answer: 0,
    explain: "A carrier shows the dominant trait but can still pass the recessive allele on.",
  },
];

type Pheno = { eyes: boolean; scales: boolean; wings: boolean; size: boolean };
type ChildRow = { trait: string; pair: string; phenotype: string; zygosity: string };
type Specimen = { name: string; rows: ChildRow[]; pheno: Pheno };

function DnaLab() {
  const [a, setA] = useState<Record<string, Genotype>>({
    eyes: "het",
    scales: "hom-dom",
    wings: "het",
    size: "hom-rec",
  });
  const [b, setB] = useState<Record<string, Genotype>>({
    eyes: "hom-rec",
    scales: "het",
    wings: "hom-rec",
    size: "het",
  });
  const [child, setChild] = useState<ChildRow[] | null>(null);
  const [pheno, setPheno] = useState<Pheno>({
    eyes: true,
    scales: true,
    wings: false,
    size: false,
  });
  const [name, setName] = useState("SPECIMEN-01");
  const [saved, setSaved] = useState<Specimen[]>([]);
  const [crawler, setCrawler] = useState<{ specimen: Specimen; key: number } | null>(null);
  const [splicing, setSplicing] = useState(false);

  function splice() {
    setSplicing(true);
    const shown: Pheno = { eyes: false, scales: false, wings: false, size: false };
    const result = traits.map((t) => {
      const fromA = alleles(t, a[t.key] ?? "het")[Math.random() < 0.5 ? 0 : 1]!;
      const fromB = alleles(t, b[t.key] ?? "het")[Math.random() < 0.5 ? 0 : 1]!;
      const pair = [fromA, fromB].sort().join("");
      const hasDominant = pair.includes(t.dominant.allele);
      shown[t.key as keyof Pheno] = hasDominant;
      const zygosity =
        fromA === fromB
          ? hasDominant
            ? "Two strong genes (homozygous dominant)"
            : "Two hidden genes (homozygous recessive)"
          : "One of each (heterozygous)";
      return {
        trait: t.label,
        pair,
        phenotype: hasDominant ? t.dominant.label : t.recessive.label,
        zygosity,
      };
    });
    window.setTimeout(() => {
      setChild(result);
      setPheno(shown);
      setSplicing(false);
    }, 700);
  }

  function saveSpecimen() {
    if (!child) return;
    const specimen: Specimen = { name: name.trim() || "UNNAMED", rows: child, pheno };
    setSaved((s) => [...s, specimen]);
    setCrawler({ specimen, key: Date.now() });
  }


  function parentPanel(
    title: string,
    state: Record<string, Genotype>,
    set: (v: Record<string, Genotype>) => void,
    accentClass: string,
  ) {
    return (
      <section className="panel p-5">
        <h2 className={`text-lg neon-text ${accentClass}`}>{title}</h2>
        {traits.map((t) => (
          <div key={t.key} className="mt-4">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{t.label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {genotypeOptions.map((g) => (
                <button
                  key={g.value}
                  onClick={() => set({ ...state, [t.key]: g.value })}
                  className={`flex-1 min-w-[9rem] rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                    state[t.key] === g.value
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  <span className="block text-foreground">{g.plain(t)}</span>
                  <span className="block text-xs text-muted-foreground">
                    {g.hint(t)} · genes {g.code(t)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <LabShell
      eyebrow="Station 02"
      title="DNA SPLICER"
      intro="Pick what each parent looks like — eye glow, skin, wings and size — then splice. Each parent passes on one gene per trait, and a strong (dominant) gene always shows over a hidden (recessive) one."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {parentPanel("Parent A", a, setA, "text-neon-cyan")}
        {parentPanel("Parent B", b, setB, "text-neon-magenta")}
      </div>

      <div className="text-center">
        <button
          onClick={splice}
          className="rounded-md bg-primary px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          {splicing ? "Splicing…" : "Splice DNA"}
        </button>
      </div>

      <section className="panel neon-glow p-5">
        <h2 className="text-lg text-neon-lime neon-text">Offspring readout</h2>
        {!child ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No sequence yet. Run the splicer to generate an organism.
          </p>
        ) : (
          <>
            <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-2">
              <CreaturePreview
                eyes={pheno.eyes}
                scales={pheno.scales}
                wings={pheno.wings}
                size={pheno.size}
                name={name}
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {child.map((c) => (
                <div key={c.trait} className="rounded-md border border-border bg-secondary/40 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {c.trait}
                  </p>
                  <p className="mt-1 font-display text-lg text-primary">{c.phenotype}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.zygosity} · genes {c.pair}
                  </p>
                </div>
              ))}
            </div>
            <label className="mt-5 block text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Specimen name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-secondary/40 px-3 py-2 font-display text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={saveSpecimen}
              className="mt-3 w-full rounded-md bg-primary px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Name &amp; release specimen
            </button>
          </>
        )}
      </section>

      {crawler && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-56 overflow-hidden">
          <div
            key={crawler.key}
            className="crawl-across absolute bottom-2 left-0 w-40"
            onAnimationEnd={() => setCrawler(null)}
          >
            <div className="creature-scuttle">
              <CreaturePreview
                eyes={crawler.specimen.pheno.eyes}
                scales={crawler.specimen.pheno.scales}
                wings={crawler.specimen.pheno.wings}
                size={crawler.specimen.pheno.size}
                name={crawler.specimen.name}
              />
            </div>
          </div>
        </div>
      )}

      {saved.length > 0 && (
        <section className="panel p-5">
          <h2 className="text-lg text-neon-amber neon-text">
            Specimen vault · {saved.length} saved
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((s, i) => (
              <article
                key={`${s.name}-${i}`}
                className="rounded-xl border border-border bg-secondary/30 p-3"
              >
                <CreaturePreview
                  eyes={s.pheno.eyes}
                  scales={s.pheno.scales}
                  wings={s.pheno.wings}
                  size={s.pheno.size}
                  name={s.name}
                />
                <p className="mt-2 font-display text-sm text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.rows.map((r) => r.phenotype).join(" · ")}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCrawler({ specimen: s, key: Date.now() })}
                    className="rounded-md border border-border px-2.5 py-1 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    Crawl
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaved((list) => list.filter((_, j) => j !== i))}
                    className="rounded-md border border-border px-2.5 py-1 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                  >
                    Release
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}


      <Quiz title="Genetics clearance quiz" questions={dnaQuiz} />
    </LabShell>
  );
}
