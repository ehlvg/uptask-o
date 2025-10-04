import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light",
      icon: Sun,
      description: "Light mode",
    },
    {
      value: "dark" as const,
      label: "Dark",
      icon: Moon,
      description: "Dark mode",
    },
    {
      value: "system" as const,
      label: "System",
      icon: Monitor,
      description: "Follow system theme",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your application preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Settings Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Appearance</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Choose how the app looks to you
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;

                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-auto flex-col gap-2 py-4",
                      !isSelected && "hover:bg-accent"
                    )}
                    onClick={() => setTheme(option.value)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </Button>
                );
              })}
            </div>

            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                {theme === "system" && (
                  <>
                    <Monitor className="inline h-4 w-4 mr-1 align-text-bottom" />
                    Theme will automatically match your operating system
                    preferences
                  </>
                )}
                {theme === "light" && (
                  <>
                    <Sun className="inline h-4 w-4 mr-1 align-text-bottom" />
                    Light mode is active
                  </>
                )}
                {theme === "dark" && (
                  <>
                    <Moon className="inline h-4 w-4 mr-1 align-text-bottom" />
                    Dark mode is active
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
