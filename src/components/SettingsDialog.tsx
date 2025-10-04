import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useTheme,
  accentColors,
  type AccentColor,
} from "@/contexts/ThemeContext";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

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

  const colorOptions: AccentColor[] = [
    "default",
    "purple",
    "green",
    "red",
    "gold",
    "blue",
    "graphite",
    "pink",
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

          {/* Accent Color Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Accent Color</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Customize the primary color of your app
              </p>
            </div>

            <TooltipProvider delayDuration={200}>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => {
                  const colorData = accentColors[color];
                  const isSelected = accentColor === color;

                  return (
                    <Tooltip key={color}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setAccentColor(color)}
                          className={cn(
                            "relative w-8 h-8 rounded-3xl transition-all duration-200",
                            "hover:scale-110 hover:shadow-lg",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
                            isSelected &&
                              "ring-2 ring-offset-2 ring-ring scale-110"
                          )}
                          style={{
                            backgroundColor: colorData.preview,
                          }}
                          aria-label={`Select ${colorData.name}`}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check
                                className="h-4 w-4 text-white drop-shadow-lg"
                                strokeWidth={3}
                              />
                            </div>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{colorData.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
