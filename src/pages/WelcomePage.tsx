import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function WelcomePage() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>welcome to uptask</CardTitle>
            <CardDescription>
              it is a calm and welcoming task manager. for the real work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/login">get started</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
