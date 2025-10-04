import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the OAuth tokens from the URL hash
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error during auth callback:", error.message);
          navigate("/login", {
            state: { error: "Authentication failed. Please try again." },
          });
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // No session found, redirect to login
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Unexpected error during auth callback:", error);
        navigate("/login", {
          state: { error: "An unexpected error occurred." },
        });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Authenticating...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="mt-4 text-muted-foreground">
            Please wait while we complete your sign in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
