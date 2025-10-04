import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  FolderKanban,
  Sparkles,
  Github,
  Shield,
  Zap,
} from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-card border-2 border-border shadow-lg flex items-center justify-center">
            <img
              src="/favicon.svg"
              alt="uptask"
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              uptask
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              a calm and welcoming task manager.
              <br />
              for the real work.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/login">
                get started
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              <a
                href="https://github.com/ehlvg/uptask-o"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-5 w-5" />
                view on github
              </a>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 md:mt-32 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">simple task tracking</h3>
            <p className="text-muted-foreground text-sm">
              create, complete, and manage tasks with descriptions and due
              dates. no unnecessary complexity.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FolderKanban className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">project organization</h3>
            <p className="text-muted-foreground text-sm">
              organize tasks into projects with custom icons. keep everything
              structured and easy to find.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">real-time sync</h3>
            <p className="text-muted-foreground text-sm">
              changes sync automatically across all your devices. powered by
              Supabase real-time updates.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">private by default</h3>
            <p className="text-muted-foreground text-sm">
              row-level security ensures your data stays yours. built with
              privacy in mind from day one.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Github className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              github authentication
            </h3>
            <p className="text-muted-foreground text-sm">
              secure sign-in with your GitHub account. no passwords to remember
              or manage.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">beautiful design</h3>
            <p className="text-muted-foreground text-sm">
              modern, responsive UI with dark mode and customizable accent
              colors. built with shadcn/ui.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 md:mt-32 text-center text-sm text-muted-foreground">
          <p>built with React, TypeScript, and Supabase</p>
          <p className="mt-2">keep building ✨</p>
        </div>
      </div>
    </div>
  );
}
