import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LabShell } from "@/components/LabShell";
import { Quiz, type QuizQuestion } from "@/components/Quiz";

export const Route = createFileRoute("/chem-lab")({
  head: () => ({
    meta: [
      { title: "Chemical Mixer — Combine and Re-combine Compounds | Neon Lab" },
      {
        name: "description",
        content:
          "Mix two substances into a new compound, then keep mixing your discoveries into stranger results, and test yourself with the chemistry quiz.",
      },
      { property: "og:title", content: "Chemical Mixer — Combine and Re-combine" },
      {
        property: "og:description",
        content: "A chaining chemistry bench: every product becomes a new ingredient.",
      },
    ],
  }),
  component: ChemLab,
});

type Recipe = { a: string; b: string; result: string; note: string };

const startingSubstances = ["Hydrogen", "Oxygen", "Carbon", "Sodium", "Chlorine", "Heat"];

const recipes: Recipe[] = [
  { a: "Hydrogen", b: "Oxygen", result: "Water", note: "2H₂ + O₂ → 2H₂O. A classic synthesis reaction." },
  { a: "Sodium", b: "Chlorine", result: "Salt", note: "Sodium gives an electron to chlorine: an ionic bond." },
  { a: "Carbon", b: "Oxygen", result: "Carbon Dioxide", note: "Complete combustion of carbon gives CO₂." },
  { a: "Carbon", b: "Hydrogen", result: "Methane", note: "CH₄ — the simplest hydrocarbon." },
  { a: "Water", b: "Salt", result: "Brine", note: "A solution: salt dissolves but no new bonds form." },
  { a: "Water", b: "Carbon Dioxide", result: "Carbonic Acid", note: "This weak acid makes fizzy drinks tangy." },
  { a: "Water", b: "Heat", result: "Steam", note: "A physical change of state — same molecule, more energy." },
  { a: "Methane", b: "Heat", result: "Flame", note: "Combustion releases stored chemical energy as light and heat." },
  { a: "Carbonic Acid", b: "Salt", result: "Baking Soda", note: "Sodium bicarbonate, the classic kitchen base." },
  { a: "Baking Soda", b: "Carbonic Acid", result: "Fizz Eruption", note: "Acid plus base releases CO₂ gas — the volcano trick." },
  { a: "Brine", b: "Heat", result: "Salt Crystals", note: "Evaporation leaves the solute behind as crystals." },
  { a: "Steam", b: "Carbon", result: "Syngas", note: "Steam over hot carbon makes hydrogen and carbon monoxide." },
  { a: "Flame", b: "Oxygen", result: "Plasma Arc", note: "Add enough energy and gas ionises into plasma." },
  { a: "Plasma Arc", b: "Hydrogen", result: "Fusion Spark", note: "Fusion is how stars turn hydrogen into helium." },
];

const chemQuiz: QuizQuestion[] = [
  {
    question: "What is the chemical formula for water?",
    options: ["H₂O", "HO₂", "H₂O₂"],
    answer: 0,
    explain: "Two hydrogen atoms bonded to one oxygen atom.",
  },
  {
    question: "Boiling water into steam is which kind of change?",
    options: ["Chemical change", "Physical change", "Nuclear change"],
    answer: 1,
    explain: "The molecule stays H₂O; only its state changes.",
  },
  {
    question: "Table salt forms when sodium and chlorine make which bond?",
    options: ["Ionic bond", "Covalent bond", "Metallic bond"],
    answer: 0,
    explain: "Sodium transfers an electron to chlorine, forming charged ions.",
  },
  {
    question: "Mixing an acid and a base produces...",
    options: ["A neutralisation reaction", "Nothing at all", "Only heat"],
    answer: 0,
    explain: "Neutralisation makes a salt and water — and often gas.",
  },
];

function ChemLab() {
  const [inventory, setInventory] = useState<string[]>(startingSubstances);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("Select two substances, then mix.");
  const [discovered, setDiscovered] = useState<string[]>([]);

  function toggle(item: string) {
    setSelected((s) =>
      s.includes(item) ? s.filter((x) => x !== item) : s.length < 2 ? [...s, item] : [s[1]!, item],
    );
  }

  function mix() {
    if (selected.length !== 2) {
      setMessage("You need exactly two substances in the beaker.");
      return;
    }
    const [x, y] = selected as [string, string];
    const recipe = recipes.find(
      (r) => (r.a === x && r.b === y) || (r.a === y && r.b === x),
    );
    if (!recipe) {
      setMessage(`${x} + ${y} → no reaction. Nothing but a cloudy beaker.`);
      setSelected([]);
      return;
    }
    setMessage(`${x} + ${y} → ${recipe.result}. ${recipe.note}`);
    setSelected([]);
    setInventory((inv) => (inv.includes(recipe.result) ? inv : [...inv, recipe.result]));
    setDiscovered((d) => (d.includes(recipe.result) ? d : [...d, recipe.result]));
  }

  function reset() {
    setInventory(startingSubstances);
    setSelected([]);
    setDiscovered([]);
    setMessage("Bench cleared. Select two substances, then mix.");
  }

  return (
    <LabShell
      eyebrow="Station 03"
      title="CHEMICAL MIXER"
      intro="Pick any two substances and mix them. Every product joins your shelf, so you can mix your discoveries again and chain your way to a fusion spark."
    >
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <section className="panel p-5">
          <h2 className="text-lg text-neon-lime neon-text">Substance shelf</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {inventory.map((item) => (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  selected.includes(item)
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={mix}
              className="rounded-md bg-primary px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Mix
            </button>
            <button
              onClick={reset}
              className="rounded-md border border-border px-4 py-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:border-destructive hover:text-destructive"
            >
              Clear bench
            </button>
          </div>
          <p className="mt-4 text-sm text-foreground">{message}</p>
        </section>

        <section className="panel neon-glow p-5">
          <h2 className="text-lg text-neon-cyan neon-text">Beaker</h2>
          <div className="relative mx-auto mt-4 h-40 w-28 overflow-hidden rounded-b-3xl border-2 border-primary/60">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary/25" />
            {selected.map((s, i) => (
              <span
                key={s}
                className="bubble absolute bottom-4 h-3 w-3 rounded-full bg-accent/70"
                style={{ left: `${25 + i * 35}%`, animationDelay: `${i * 0.6}s` }}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            {selected.length ? selected.join(" + ") : "Empty"}
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Discovered ({discovered.length}/{recipes.length})
          </p>
          <p className="mt-1 text-sm text-neon-lime">
            {discovered.length ? discovered.join(", ") : "Nothing yet"}
          </p>
        </section>
      </div>

      <Quiz title="Chemistry clearance quiz" questions={chemQuiz} />
    </LabShell>
  );
}
