import { createFileRoute, Link } from "@tanstack/react-router";
import { LabShell } from "@/components/LabShell";
import { Quiz, type QuizQuestion } from "@/components/Quiz";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neon Lab — Digital Science Lab for Robots, DNA & Chemistry" },
      {
        name: "description",
        content:
          "Build digital robots with an AI assistant, splice DNA from two parents, and mix chemicals into new compounds — with a quiz in every lab.",
      },
      { property: "og:title", content: "Neon Lab — Digital Science Lab" },
      {
        property: "og:description",
        content: "Robot builder, DNA splicer and chemical mixer in one neon-lit virtual lab.",
      },
    ],
  }),
  component: Hub,
});

const stations = [
  {
    to: "/robot-lab" as const,
    code: "ST-01",
    name: "Robotics Bay",
    blurb: "Assemble a digital robot part by part and quiz your AI lab assistant for facts.",
    color: "text-neon-cyan",
  },
  {
    to: "/dna-lab" as const,
    code: "ST-02",
    name: "DNA Splicer",
    blurb: "Feed in traits from Parent A and Parent B, then splice a brand-new organism.",
    color: "text-neon-magenta",
  },
  {
    to: "/chem-lab" as const,
    code: "ST-03",
    name: "Chemical Mixer",
    blurb: "Combine two substances, keep the product, and mix it again into something stranger.",
    color: "text-neon-lime",
  },
];

const hubQuiz: QuizQuestion[] = [
  {
    question: "Which of these is the correct order of the scientific method?",
    options: [
      "Conclusion, experiment, question",
      "Question, hypothesis, experiment, conclusion",
      "Hypothesis, conclusion, question",
    ],
    answer: 1,
    explain: "You ask, guess, test, then conclude — and often loop back to ask again.",
  },
  {
    question: "What is a hypothesis?",
    options: [
      "A testable prediction",
      "A proven fact",
      "A measurement tool",
    ],
    answer: 0,
    explain: "A hypothesis is a prediction you can test and possibly disprove.",
  },
  {
    question: "Why do scientists repeat experiments?",
    options: [
      "To use up spare chemicals",
      "To check results are reliable, not a fluke",
      "Because rules say three times",
    ],
    answer: 1,
    explain: "Repetition exposes random error and confirms the result is real.",
  },
];

function Hub() {
  return (
    <LabShell
      eyebrow="Access granted"
      title="NEON LAB"
      intro="Three live stations, one glowing facility. Build machines, splice genomes, brew compounds — and prove what you learned in the station quizzes."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {stations.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="panel group p-5 transition-shadow hover:neon-glow"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground">{s.code}</p>
            <h2 className={`mt-2 text-lg ${s.color} neon-text`}>{s.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Enter station →
            </p>
          </Link>
        ))}
      </div>

      <Quiz title="Entry test: lab basics" questions={hubQuiz} />
    </LabShell>
  );
}
