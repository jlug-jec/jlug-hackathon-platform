import Link from "next/link"
import { Lock, Unlock } from "lucide-react"

import { formatInTimezone, getProblemStatementContext } from "@/lib/problem-statements"

export function ProblemStatementsSection() {
  const context = getProblemStatementContext()
  const revealText = formatInTimezone(context.revealAt, context.timezone)
  const deadlineText = formatInTimezone(context.submissionDeadline, context.timezone)

  return (
    <section id="problems" className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Problem Domains
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            {context.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
            Reveal time: <span className="font-semibold text-foreground">{revealText}</span>
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-muted-foreground">
            Submission deadline: <span className="font-semibold text-foreground">{deadlineText}</span>
          </p>
          
        </div>

        {!context.isRevealed ? (
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-foreground">Problem Domains Are Locked</h3>
            <p className="mt-3 text-muted-foreground">
              Problem Domains will be revealed soon.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {context.items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {item.id}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-primary">
                    <Unlock className="h-3.5 w-3.5" />
                    Revealed
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                {item.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={`${item.id}-${tag}`}
                        className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Register Team
          </Link>
        </div>
      </div>
    </section>
  )
}
