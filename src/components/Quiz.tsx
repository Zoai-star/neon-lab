import { useState } from "react";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export function Quiz({ title, questions }: { title: string; questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index]!;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  return (
    <section className="panel neon-glow-magenta p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Lab quiz</p>
      <h2 className="mt-1 text-lg text-foreground">{title}</h2>

      {done ? (
        <div className="mt-4">
          <p className="font-display text-3xl text-neon-lime neon-text">
            {score}/{questions.length}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {score === questions.length
              ? "Perfect run — certified lab technician."
              : "Not bad. Run it again to raise your clearance level."}
          </p>
          <button
            onClick={restart}
            className="mt-4 rounded-md border border-accent px-4 py-2 text-sm font-semibold uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Retry quiz
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Question {index + 1} of {questions.length}
          </p>
          <p className="mt-2 text-base text-foreground">{q.question}</p>
          <ul className="mt-3 grid gap-2">
            {q.options.map((opt, i) => {
              const isAnswer = i === q.answer;
              const state =
                picked === null
                  ? "border-border hover:border-primary"
                  : isAnswer
                    ? "border-neon-lime text-neon-lime"
                    : picked === i
                      ? "border-destructive text-destructive"
                      : "border-border opacity-60";
              return (
                <li key={opt}>
                  <button
                    onClick={() => choose(i)}
                    className={`w-full rounded-md border bg-secondary/40 px-3 py-2 text-left text-sm transition-colors ${state}`}
                  >
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
          {picked !== null && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">{q.explain}</p>
              <button
                onClick={next}
                className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
              >
                {index + 1 === questions.length ? "See score" : "Next"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
