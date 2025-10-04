import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthForm() {
  const [error, setError] = useState<string>("");
  const { signInWithGitHub, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleGitHubSignIn = async () => {
    try {
      setError("");
      await signInWithGitHub();
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(
        error?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t("auth.welcomeTitle")}
          </CardTitle>
          <p className="text-muted-foreground">{t("auth.signInDescription")}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGitHubSignIn}
            className="w-full"
            disabled={isLoading}
            size="lg"
          >
            <Github className="mr-2 h-5 w-5" />
            {isLoading ? t("auth.connecting") : t("auth.signInWithGithub")}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>{t("auth.termsNotice")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
