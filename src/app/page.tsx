import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  GitBranch, 
  Target, 
  BarChart2, 
  Skull, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Github,
  Linkedin
} from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { workspaceMembers, workspaces } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { DecisionLogMockup, OutcomeTrackingMockup, DecisionGraphMockup } from "@/components/landing/mockups";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user?.id) {
    // If logged in, find user's first workspace and redirect
    const [member] = await db
      .select()
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, session.user.id))
      .limit(1);

    if (member) {
      redirect(`/app/${member.workspaces.slug}/dashboard`);
    } else {
      // Logged in but no workspace
      redirect("/new-workspace");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <span className="text-lg">D</span>
            </div>
            <span>Decision DNA</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200">
              <Link href="/signup">Start Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-16">
        {/* Hero */}
        <section className="relative px-6 lg:px-8 text-center max-w-5xl mx-auto py-20 lg:py-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full -z-10" />
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent pb-4">
            Your team&apos;s decisions <br />
            are your most valuable asset.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Decision DNA Tracker logs <strong>why</strong> decisions were made, what data you had, and whether you were right. 
            Build institutional memory that survives team changes.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white border-none">
              <Link href="/signup">Start Building Memory</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800">
              <Link href="#features">
                See how it works <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">No credit card required • Free for small teams</p>
        </section>

        {/* The Problem */}
        <section className="py-20 border-y border-white/5 bg-zinc-900/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Knowledge Decay</h3>
                <p className="text-zinc-400">New hires spend months asking "why is this built this way?" because the context left with the previous engineer.</p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <Skull className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Zombie Ideas</h3>
                <p className="text-zinc-400">The same bad idea gets proposed every 6 months because no one logged why it was rejected last time.</p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Outcome Amnesia</h3>
                <p className="text-zinc-400">Features launch and no one remembers to check if they actually solved the original problem.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-24">
            
            {/* Feature 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-500 mb-6">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Decision Log</h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  Document not just <strong>WHAT</strong> you decided, but <strong>WHY</strong>. Capture the context, the options you considered, the pros and cons, and the evidence that led you there.
                </p>
                <ul className="mt-8 space-y-3">
                  {["Structured decision framework", "Option analysis with pros/cons", "Hypothesis tracking"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-zinc-300">
                      <CheckCircle2 className="h-5 w-5 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-800 overflow-hidden shadow-2xl shadow-black/50">
                <DecisionLogMockup />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
              <div className="order-last lg:order-first rounded-xl border border-zinc-800 overflow-hidden shadow-2xl shadow-black/50">
                <OutcomeTrackingMockup />
              </div>
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-500 mb-6">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Outcome Tracking</h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  Come back 90 days later. Was your hypothesis right? Force your team to learn from every bet you make, whether it succeeded or failed.
                </p>
                <ul className="mt-8 space-y-3">
                  {["Automated review reminders", "Validate/Invalidate hypotheses", "Track team success rate"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-zinc-300">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20 text-purple-500 mb-6">
                  <GitBranch className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Decision Graph</h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  See how decisions connect. Trace a feature back to the strategy that created it. Visualize dependencies and understand the ripple effects of your choices.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 overflow-hidden shadow-2xl shadow-black/50">
                <DecisionGraphMockup />
              </div>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10 -z-10" />
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Start building your team's memory today.
            </h2>
            <p className="text-lg text-zinc-300 mb-10">
              Stop repeating mistakes. Start making better decisions.
            </p>
            <Button asChild size="lg" className="h-14 px-10 text-lg bg-white text-zinc-950 hover:bg-zinc-200">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-zinc-200">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-xs">D</div>
            <span>Decision DNA</span>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Decision DNA Tracker. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">Made by</span>
            <a href="https://github.com/anurag-mallick" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
              <Github className="h-4 w-4" />
              <span>Anurag Mallick</span>
            </a>
            <a href="https://www.linkedin.com/in/anuragmallick901/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
