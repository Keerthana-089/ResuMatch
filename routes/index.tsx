import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, FileSearch, Sparkles, TrendingUp, Target, Zap } from "lucide-react";
import { JOB_ROLES } from "@/lib/jobRoles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResuMatch — AI Resume ATS Optimizer" },
      {
        name: "description",
        content:
          "Upload your resume, get an instant ATS score, keyword analysis, AI summary, and tailored suggestions to land more interviews.",
      },
      { property: "og:title", content: "ResuMatch — AI Resume ATS Optimizer" },
      {
        property: "og:description",
        content: "Beat the bots. Score your resume against any job role in seconds.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Target,
    title: "ATS Score Checker",
    text: "Weighted score across keywords, structure, formatting and readability.",
  },
  {
    icon: FileSearch,
    title: "Keyword Extraction",
    text: "NLP pulls out your skills and shows what's missing for the role.",
  },
  {
    icon: Sparkles,
    title: "AI Summary",
    text: "A crisp recruiter-ready summary of skills, experience and wins.",
  },
  {
    icon: TrendingUp,
    title: "Live Role Trends",
    text: "See which skills are surging right now for your target role.",
  },
];

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">ResuMatch</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#roles" className="hover:text-foreground transition">Roles</a>
        </nav>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Analyze resume <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* hero */}
      <section className="relative">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              AI-powered ATS optimization
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              Beat the bots.
              <br />
              <span className="text-gradient-primary">Land the interview.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Drop in your resume, pick a role, and ResuMatch scores it like an Applicant Tracking
              System — then tells you exactly what to fix.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/analyze"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition hover:opacity-90 glow-primary"
              >
                Analyze my resume
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-7 py-3.5 text-base font-medium text-foreground backdrop-blur transition hover:bg-card"
              >
                See how it works
              </a>
            </div>
          </motion.div>

          {/* score visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-20 max-w-5xl"
          >
            <div className="surface-card relative overflow-hidden p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Your resume
                  </div>
                  <div className="mt-3 space-y-2">
                    {["Senior Data Analyst · 6y", "Python · SQL · Tableau", "Led 12-person team"].map(
                      (t) => (
                        <div
                          key={t}
                          className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground/90"
                        >
                          {t}
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="68"
                        fill="none"
                        stroke="var(--color-muted)"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="68"
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 68}
                        initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - 0.87) }}
                        transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                        transform="rotate(-90 80 80)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="font-display text-4xl font-bold text-gradient-primary">87</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">
                        ATS Score
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Suggestions
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
                      + Add "dbt" and "Snowflake"
                    </div>
                    <div className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2">
                      ↑ Quantify last 2 bullets
                    </div>
                    <div className="rounded-lg border border-border bg-muted/50 px-3 py-2">
                      ✓ Strong section structure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary">Features</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Everything you need to <span className="text-gradient-primary">get past the filter.</span>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="surface-card p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* how */}
      <section id="how" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary">How it works</div>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Three steps. Thirty seconds.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No sign-up. No fluff. Just a real ATS-style audit powered by modern AI.
            </p>
          </div>
          <ol className="space-y-4">
            {[
              ["Upload", "Drop a PDF, DOCX or TXT. We extract the text server-side."],
              ["Pick a role", "Choose your target job — we load its keyword profile."],
              ["Get your report", "Score, missing keywords, summary, trends and fixes."],
            ].map(([t, d], i) => (
              <li key={t} className="surface-card flex gap-4 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold">{t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* roles */}
      <section id="roles" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 text-center">
          <div className="text-xs uppercase tracking-widest text-primary">Supported roles</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Tuned for the roles you're chasing.
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {JOB_ROLES.map((r) => (
            <Link
              key={r.id}
              to="/analyze"
              className="rounded-full border border-border bg-card/40 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              {r.title}
            </Link>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="relative mx-auto max-w-7xl px-6 pb-32">
        <div className="surface-card relative overflow-hidden p-12 text-center md:p-20">
          <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold md:text-6xl">
              Stop guessing. <span className="text-gradient-primary">Start matching.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Your next interview is one upload away.
            </p>
            <Link
              to="/analyze"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition hover:opacity-90 glow-primary"
            >
              Analyze my resume <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <span>ResuMatch</span>
          </div>
          <div>© {new Date().getFullYear()} · Built with Lovable</div>
        </div>
      </footer>
    </main>
  );
}
