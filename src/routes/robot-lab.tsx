import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LabShell } from "@/components/LabShell";
import { Quiz, type QuizQuestion } from "@/components/Quiz";
import { RobotPreview } from "@/components/RobotPreview";
import { useServerFn } from "@tanstack/react-start";
import { askAda } from "@/lib/ada.functions";

export const Route = createFileRoute("/robot-lab")({
  head: () => ({
    meta: [
      { title: "Robotics Bay — Build a Digital Robot | Neon Lab" },
      {
        name: "description",
        content:
          "Assemble a digital robot from heads, chassis, limbs and power cores, ask the AI lab assistant for robotics facts, then take the robotics quiz.",
      },
      { property: "og:title", content: "Robotics Bay — Build a Digital Robot" },
      {
        property: "og:description",
        content: "Pick parts, power up your bot and quiz yourself on robotics.",
      },
    ],
  }),
  component: RobotLab,
});

type PartKey = "head" | "chassis" | "limbs" | "core";

const parts: Record<PartKey, { name: string; stats: [number, number, number] }[]> = {
  head: [
    { name: "Optic Scanner", stats: [3, 0, 2] },
    { name: "Thermal Dome", stats: [1, 2, 1] },
    { name: "Antenna Array", stats: [2, 0, 3] },
  ],
  chassis: [
    { name: "Titan Frame", stats: [0, 4, 1] },
    { name: "Carbon Shell", stats: [2, 2, 1] },
    { name: "Hover Ring", stats: [3, 1, 2] },
  ],
  limbs: [
    { name: "Grapple Claws", stats: [1, 3, 0] },
    { name: "Track Treads", stats: [2, 2, 0] },
    { name: "Servo Legs", stats: [3, 1, 1] },
  ],
  core: [
    { name: "Fusion Cell", stats: [2, 1, 3] },
    { name: "Solar Bank", stats: [1, 1, 4] },
    { name: "Kinetic Coil", stats: [4, 1, 0] },
  ],
};

const partOrder: PartKey[] = ["head", "chassis", "limbs", "core"];
const partLabels: Record<PartKey, string> = {
  head: "Head module",
  chassis: "Chassis",
  limbs: "Locomotion",
  core: "Power core",
};

const robotQuiz: QuizQuestion[] = [
  {
    question: "What is an actuator on a robot?",
    options: ["A part that senses light", "A part that creates movement", "A data storage chip"],
    answer: 1,
    explain: "Actuators convert energy into motion — motors, servos and pistons.",
  },
  {
    question: "LIDAR measures distance by...",
    options: [
      "Timing how long a laser pulse takes to return",
      "Weighing the air",
      "Listening to engine noise",
    ],
    answer: 0,
    explain: "Light travels at a known speed, so time-of-flight gives distance.",
  },
  {
    question: "Which loop describes robot control?",
    options: ["Sense, plan, act", "Print, scan, copy", "Charge, sleep, reset"],
    answer: 0,
    explain: "Every autonomous robot repeats sense → plan → act many times a second.",
  },
  {
    question: "Where does the word 'robot' come from?",
    options: ["Greek for metal", "Czech 'robota', meaning forced labour", "Latin for helper"],
    answer: 1,
    explain: "It was coined in Karel Čapek's 1920 play R.U.R.",
  },
];

function RobotLab() {
  const [choice, setChoice] = useState<Record<PartKey, number>>({
    head: 0,
    chassis: 0,
    limbs: 0,
    core: 0,
  });
  const [name, setName] = useState("UNIT-01");
  const [saved, setSaved] = useState<
    { name: string; choice: Record<PartKey, number>; totals: [number, number, number] }[]
  >([]);
  const [walker, setWalker] = useState<
    { name: string; choice: Record<PartKey, number>; key: number } | null
  >(null);
  const [question, setQuestion] = useState("");
  const [log, setLog] = useState<{ role: "you" | "ada"; text: string }[]>([
    {
      role: "ada",
      text: "ADA online. I'm your lab assistant — ask me anything about robots, science or your build and I'll answer properly.",
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const askAdaFn = useServerFn(askAda);

  const totals = partOrder.reduce(
    (acc, key) => {
      const stats = parts[key][choice[key]]!.stats;
      return [acc[0] + stats[0], acc[1] + stats[1], acc[2] + stats[2]] as [number, number, number];
    },
    [0, 0, 0] as [number, number, number],
  );

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const text = question.trim();
    if (!text || thinking) return;
    const history = log
      .slice(1)
      .map((m) => ({ role: m.role === "ada" ? ("assistant" as const) : ("user" as const), content: m.text }))
      .slice(-10);
    setLog((l) => [...l, { role: "you", text }]);
    setQuestion("");
    setThinking(true);
    try {
      const res = await askAdaFn({ data: { question: text, history } });
      setLog((l) => [...l, { role: "ada", text: res.answer }]);
    } catch (err) {
      setLog((l) => [
        ...l,
        {
          role: "ada",
          text: err instanceof Error ? err.message : "ADA hit a transmission error. Try again.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }


  const statLabels = ["Speed", "Strength", "Smarts"];

  function deploy() {
    const unitName = name.trim() || "UNNAMED";
    setSaved((s) => [...s, { name: unitName, choice: { ...choice }, totals }]);
    setWalker({ name: unitName, choice: { ...choice }, key: Date.now() });
  }

  return (
    <LabShell
      eyebrow="Station 01"
      title="ROBOTICS BAY"
      intro="Swap modules to change your robot's stats, name your unit, then interrogate ADA — the resident AI assistant — for robotics facts."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <section className="panel p-5">
          <h2 className="text-lg text-neon-cyan neon-text">Assembly bench</h2>
          <label className="mt-4 block text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Unit designation
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-secondary/40 px-3 py-2 font-display text-sm text-foreground outline-none focus:border-primary"
          />
          {partOrder.map((key) => (
            <div key={key} className="mt-4">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {partLabels[key]}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {parts[key].map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setChoice((c) => ({ ...c, [key]: i }))}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      choice[key] === i
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="panel neon-glow p-5">
          <h2 className="text-lg text-neon-lime neon-text">Build readout</h2>
          <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-2">
            <RobotPreview
              head={choice.head}
              chassis={choice.chassis}
              limbs={choice.limbs}
              core={choice.core}
              name={name}
            />
          </div>
          <p className="mt-3 font-display text-2xl text-foreground">{name || "UNNAMED"}</p>
          <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
            {partOrder.map((key) => (
              <li key={key}>
                {partLabels[key]}: <span className="text-foreground">{parts[key][choice[key]]!.name}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-3">
            {totals.map((v, i) => (
              <div key={statLabels[i]}>
                <div className="flex justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  <span>{statLabels[i]}</span>
                  <span className="text-primary">{v}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min(100, (v / 12) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={deploy}
            className="mt-5 w-full rounded-md bg-primary px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Submit &amp; deploy unit
          </button>
        </section>
      </div>

      {walker && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-56 overflow-hidden">
          <div
            key={walker.key}
            className="walk-across absolute bottom-2 left-0 w-40"
            onAnimationEnd={() => setWalker(null)}
          >
            <div className="robot-bob">
              <RobotPreview
                head={walker.choice.head}
                chassis={walker.choice.chassis}
                limbs={walker.choice.limbs}
                core={walker.choice.core}
                name={walker.name}
              />
            </div>
          </div>
        </div>
      )}

      {saved.length > 0 && (
        <section className="panel p-5">
          <h2 className="text-lg text-neon-amber neon-text">Robot bay · {saved.length} saved</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((r, i) => (
              <article key={`${r.name}-${i}`} className="rounded-xl border border-border bg-secondary/30 p-3">
                <RobotPreview
                  head={r.choice.head}
                  chassis={r.choice.chassis}
                  limbs={r.choice.limbs}
                  core={r.choice.core}
                  name={r.name}
                />
                <p className="mt-2 font-display text-sm text-foreground">{r.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {statLabels.map((s, j) => `${s} ${r.totals[j]}`).join(" · ")}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setName(r.name);
                      setChoice(r.choice);
                    }}
                    className="rounded-md border border-border px-2.5 py-1 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalker({ name: r.name, choice: r.choice, key: Date.now() })}
                    className="rounded-md border border-border px-2.5 py-1 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    Walk
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaved((s) => s.filter((_, j) => j !== i))}
                    className="rounded-md border border-border px-2.5 py-1 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                  >
                    Scrap
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}


      <section className="panel p-5">
        <h2 className="text-lg text-accent neon-text">ADA · AI lab assistant</h2>
        <div className="mt-3 grid gap-2">
          {log.map((m, i) => (
            <p
              key={i}
              className={`rounded-md px-3 py-2 text-sm ${
                m.role === "ada"
                  ? "bg-secondary/50 text-foreground"
                  : "bg-primary/15 text-primary md:ml-auto"
              }`}
            >
              <span className="mr-2 text-xs uppercase tracking-widest text-muted-foreground">
                {m.role}
              </span>
              {m.text}
            </p>
          ))}
          {thinking && (
            <p className="rounded-md bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
              <span className="mr-2 text-xs uppercase tracking-widest">ada</span>
              thinking…
            </p>
          )}
        </div>
        <form onSubmit={ask} className="mt-4 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask ADA anything..."
            className="min-w-0 flex-1 rounded-md border border-input bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={thinking}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-widest text-accent-foreground disabled:opacity-50"
          >
            {thinking ? "..." : "Ask"}
          </button>
        </form>
      </section>

      <Quiz title="Robotics clearance quiz" questions={robotQuiz} />
    </LabShell>
  );
}
