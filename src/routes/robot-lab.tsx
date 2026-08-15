import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LabShell } from "@/components/LabShell";
import { Quiz, type QuizQuestion } from "@/components/Quiz";
import { RobotPreview } from "@/components/RobotPreview";

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

const facts: { keys: string[]; fact: string }[] = [
  {
    keys: ["sensor", "see", "eye", "optic", "camera"],
    fact: "Robots 'see' with sensors: cameras, LIDAR that times laser bounces, and infrared for heat. No single sensor is trusted alone — data from several is fused together.",
  },
  {
    keys: ["motor", "servo", "move", "actuator", "leg", "walk"],
    fact: "Actuators are a robot's muscles. Servo motors report their own angle back to the controller, which is how a robot arm knows exactly where its hand is.",
  },
  {
    keys: ["battery", "power", "energy", "core", "solar"],
    fact: "Most mobile robots run on lithium-ion packs. Power is the top design limit: heavier batteries give longer life but cost you speed and agility.",
  },
  {
    keys: ["ai", "brain", "learn", "neural", "think"],
    fact: "A robot's 'brain' loops three steps forever: sense, plan, act. Machine learning helps with the planning step by predicting outcomes from past data.",
  },
  {
    keys: ["law", "asimov", "safe", "safety"],
    fact: "Isaac Asimov's Three Laws of Robotics are fiction, but real robots use hard safety stops, force limits and fenced work cells instead.",
  },
  {
    keys: ["space", "mars", "rover"],
    fact: "Mars rovers drive semi-autonomously because a radio command takes 5-20 minutes to arrive. They must plan their own path around rocks.",
  },
  {
    keys: ["history", "first", "origin", "word"],
    fact: "The word 'robot' comes from the 1920 Czech play R.U.R., from 'robota', meaning forced labour. The first industrial robot, Unimate, started work in 1961.",
  },
];

const fallbackFacts = [
  "Fun fact: swarm robots follow simple local rules, yet together they behave like one organism.",
  "Fun fact: soft robots made of silicone can squeeze through gaps narrower than their own bodies.",
  "Fun fact: a robot vacuum maps your room with an internal grid and remembers where it got stuck.",
];

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
  const [question, setQuestion] = useState("");
  const [log, setLog] = useState<{ role: "you" | "ada"; text: string }[]>([
    {
      role: "ada",
      text: "ADA online. I'm your lab assistant. Ask me about sensors, motors, power, AI, safety or space robots.",
    },
  ]);

  const totals = partOrder.reduce(
    (acc, key) => {
      const stats = parts[key][choice[key]]!.stats;
      return [acc[0] + stats[0], acc[1] + stats[1], acc[2] + stats[2]] as [number, number, number];
    },
    [0, 0, 0] as [number, number, number],
  );

  function ask(e: React.FormEvent) {
    e.preventDefault();
    const text = question.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const hit = facts.find((f) => f.keys.some((k) => lower.includes(k)));
    const answer =
      hit?.fact ?? fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)]!;
    setLog((l) => [...l, { role: "you", text }, { role: "ada", text: answer }]);
    setQuestion("");
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
        </section>
      </div>

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
        </div>
        <form onSubmit={ask} className="mt-4 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="How do robots see?"
            className="min-w-0 flex-1 rounded-md border border-input bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-widest text-accent-foreground"
          >
            Ask
          </button>
        </form>
      </section>

      <Quiz title="Robotics clearance quiz" questions={robotQuiz} />
    </LabShell>
  );
}
