import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthForm() {
  const [error, setError] = useState<string>("");
  const { signInWithGitHub, isLoading } = useAuth();

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
            Welcome to uptask
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in with your GitHub account to continue
          </p>
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
            {isLoading ? "Connecting..." : "Sign in with GitHub"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
