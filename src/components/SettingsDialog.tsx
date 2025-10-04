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
import { useLanguage } from "@/contexts/LanguageContext";
import { Sun, Moon, Monitor, Check, Languages } from "lucide-react";
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
  const { language, setLanguage, t } = useLanguage();

  const themeOptions = [
    {
      value: "light" as const,
      label: t("settings.themes.light"),
      icon: Sun,
      description: t("settings.themes.lightMode"),
    },
    {
      value: "dark" as const,
      label: t("settings.themes.dark"),
      icon: Moon,
      description: t("settings.themes.darkMode"),
    },
    {
      value: "system" as const,
      label: t("settings.themes.system"),
      icon: Monitor,
      description: t("settings.themes.followSystem"),
    },
  ];

  const languageOptions = [
    { value: "en" as const, label: t("settings.languages.en") },
    { value: "ru" as const, label: t("settings.languages.ru") },
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
      <DialogContent className="max-w-[90vw] w-full sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("settings.title")}</DialogTitle>
          <DialogDescription>{t("settings.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language Settings Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">
                {t("settings.language")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t("settings.languageDescription")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {languageOptions.map((option) => {
                const isSelected = language === option.value;

                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-auto flex-col gap-2 py-5 md:py-4",
                      !isSelected && "hover:bg-accent"
                    )}
                    onClick={() => setLanguage(option.value)}
                  >
                    <Languages className="h-6 w-6 md:h-5 md:w-5" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Theme Settings Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">
                {t("settings.appearance")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t("settings.appearanceDescription")}
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
                      "h-auto flex-col gap-2 py-5 md:py-4",
                      !isSelected && "hover:bg-accent"
                    )}
                    onClick={() => setTheme(option.value)}
                  >
                    <Icon className="h-6 w-6 md:h-5 md:w-5" />
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
                    {t("settings.themes.systemActive")}
                  </>
                )}
                {theme === "light" && (
                  <>
                    <Sun className="inline h-4 w-4 mr-1 align-text-bottom" />
                    {t("settings.themes.lightActive")}
                  </>
                )}
                {theme === "dark" && (
                  <>
                    <Moon className="inline h-4 w-4 mr-1 align-text-bottom" />
                    {t("settings.themes.darkActive")}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Accent Color Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">
                {t("settings.accentColor")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t("settings.accentColorDescription")}
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
                            "relative w-10 h-10 md:w-8 md:h-8 rounded-3xl transition-all duration-200",
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
                                className="h-5 w-5 md:h-4 md:w-4 text-white drop-shadow-lg"
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
