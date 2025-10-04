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
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomePage() {
  const { t } = useLanguage();
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
              {t("welcome.title")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl whitespace-pre-line">
              {t("welcome.subtitle")}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/login">
                {t("welcome.getStarted")}
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
                {t("welcome.viewOnGithub")}
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
            <h3 className="text-lg font-semibold mb-2">
              {t("welcome.features.simpleTracking.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("welcome.features.simpleTracking.description")}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FolderKanban className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("welcome.features.projectOrganization.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("welcome.features.projectOrganization.description")}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("welcome.features.realTimeSync.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("welcome.features.realTimeSync.description")}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("welcome.features.privateByDefault.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("welcome.features.privateByDefault.description")}
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Github className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("welcome.features.githubAuth.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("welcome.features.githubAuth.description")}
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("welcome.features.beautifulDesign.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("welcome.features.beautifulDesign.description")}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 md:mt-32 text-center text-sm text-muted-foreground">
          <p>{t("welcome.builtWith")}</p>
          <p className="mt-2">{t("welcome.keepBuilding")}</p>
        </div>
      </div>
    </div>
  );
}
