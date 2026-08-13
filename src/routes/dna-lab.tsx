import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LabShell } from "@/components/LabShell";
import { Quiz, type QuizQuestion } from "@/components/Quiz";

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
  const [child, setChild] = useState<
    { trait: string; pair: string; phenotype: string; zygosity: string }[] | null
  >(null);
  const [splicing, setSplicing] = useState(false);

  function splice() {
    setSplicing(true);
    const result = traits.map((t) => {
      const fromA = alleles(t, a[t.key] ?? "het")[Math.random() < 0.5 ? 0 : 1]!;
      const fromB = alleles(t, b[t.key] ?? "het")[Math.random() < 0.5 ? 0 : 1]!;
      const pair = [fromA, fromB].sort().join("");
      const hasDominant = pair.includes(t.dominant.allele);
      const zygosity =
        fromA === fromB ? (hasDominant ? "Homozygous dominant" : "Homozygous recessive") : "Heterozygous";
      return {
        trait: t.label,
        pair,
        phenotype: hasDominant ? t.dominant.label : t.recessive.label,
        zygosity,
      };
    });
    window.setTimeout(() => {
      setChild(result);
      setSplicing(false);
    }, 700);
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
                  className={`rounded-md border px-3 py-1.5 font-display text-sm transition-colors ${
                    state[t.key] === g.value
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  {g.short(t)}
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
      intro="Set the allele pairs of Parent A and Parent B, then splice. Each parent passes one random allele per trait — capital letters are dominant."
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
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {child.map((c) => (
              <div key={c.trait} className="rounded-md border border-border bg-secondary/40 p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {c.trait}
                </p>
                <p className="mt-1 font-display text-xl text-primary">{c.pair}</p>
                <p className="text-sm text-foreground">{c.phenotype}</p>
                <p className="text-xs text-muted-foreground">{c.zygosity}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Quiz title="Genetics clearance quiz" questions={dnaQuiz} />
    </LabShell>
  );
}
