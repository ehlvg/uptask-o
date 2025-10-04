import { useState, useEffect, useMemo } from "react";
import type { Task, Project } from "@/types/tasks";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  Sun,
  CloudFog,
  Wind,
  EyeOff,
  Loader2,
} from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface GreetingWidgetProps {
  userName?: string;
}

export function GreetingWidget({ userName }: GreetingWidgetProps) {
  const { t, language } = useLanguage();

  const [greeting, setGreeting] = useState(() => {
    const savedGreeting = sessionStorage.getItem("dailyGreeting");
    const savedDate = sessionStorage.getItem("greetingDate");
    const savedLang = sessionStorage.getItem("greetingLang");
    const today = new Date().toDateString();

    // Check if we have valid cached data for today and current language
    if (savedGreeting && savedDate === today && savedLang === language) {
      // Validate that it's not a translation key
      if (!savedGreeting.includes("widgets.greeting")) {
        return savedGreeting;
      }
    }

    // Get the greetings array from translations
    const greetings = t("widgets.greeting.greetings");
    const greetingsArray =
      typeof greetings === "string" ? [greetings] : greetings;
    const newGreeting =
      greetingsArray[Math.floor(Math.random() * greetingsArray.length)];
    sessionStorage.setItem("dailyGreeting", newGreeting);
    sessionStorage.setItem("greetingDate", today);
    sessionStorage.setItem("greetingLang", language);
    return newGreeting;
  });

  // Update greeting when language changes
  useEffect(() => {
    const savedLang = sessionStorage.getItem("greetingLang");
    const savedDate = sessionStorage.getItem("greetingDate");
    const today = new Date().toDateString();

    // If language changed or it's a new day, generate new greeting
    if (savedLang !== language || savedDate !== today) {
      const greetings = t("widgets.greeting.greetings");
      const greetingsArray =
        typeof greetings === "string" ? [greetings] : greetings;
      const newGreeting =
        greetingsArray[Math.floor(Math.random() * greetingsArray.length)];
      setGreeting(newGreeting);
      sessionStorage.setItem("dailyGreeting", newGreeting);
      sessionStorage.setItem("greetingDate", today);
      sessionStorage.setItem("greetingLang", language);
    }
  }, [language, t]);

  return (
    <Card className="col-span-full">
      <CardContent className="py-4">
        <div className="space-y-1">
          {userName && (
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("widgets.greeting.hello")}, {userName.split(" ")[0]}
            </h2>
          )}
          <p className="text-muted-foreground text-base md:text-lg">
            {greeting}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskStatsWidgetProps {
  tasks: Task[];
}

export function TaskStatsWidget({ tasks }: TaskStatsWidgetProps) {
  const { t } = useLanguage();
  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const incomplete = tasks.filter((t) => !t.completed).length;
    const total = tasks.length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, incomplete, total, completionRate };
  }, [tasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("widgets.taskStats.title")}</CardTitle>
        <CardDescription>{t("widgets.taskStats.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm">
                {t("widgets.taskStats.completed")}
              </span>
            </div>
            <span className="text-2xl font-bold">{stats.completed}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-blue-500" />
              <span className="text-sm">{t("widgets.taskStats.toDo")}</span>
            </div>
            <span className="text-2xl font-bold">{stats.incomplete}</span>
          </div>
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {t("widgets.taskStats.completionRate")}
              </span>
              <span className="text-sm font-semibold">
                {stats.completionRate}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OverdueTasksWidgetProps {
  tasks: Task[];
  projects: Project[];
  onSelectProject?: (projectId: string) => void;
}

export function OverdueTasksWidget({
  tasks,
  projects,
  onSelectProject,
}: OverdueTasksWidgetProps) {
  const { t } = useLanguage();
  const [filterProjectId, setFilterProjectId] = useState<string | null>(null);

  const overdueTasks = useMemo(() => {
    const now = new Date();
    return tasks
      .filter((task) => {
        if (task.completed) return false;
        if (!task.dueDate) return false;

        try {
          return (
            isPast(parseISO(task.dueDate)) &&
            parseISO(task.dueDate).toDateString() !== now.toDateString()
          );
        } catch {
          return false;
        }
      })
      .filter((task) => !filterProjectId || task.projectId === filterProjectId)
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [tasks, filterProjectId]);

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || "Unknown";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("widgets.overdue.title")}</CardTitle>
        <CardDescription>
          {overdueTasks.length > 0
            ? `${overdueTasks.length} ${
                overdueTasks.length !== 1
                  ? t("widgets.overdue.tasks")
                  : t("widgets.overdue.task")
              } ${t("widgets.overdue.needAttention")}`
            : t("widgets.overdue.allCaughtUp")}
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {filterProjectId
                  ? getProjectName(filterProjectId)
                  : t("widgets.overdue.allProjects")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterProjectId(null)}>
                {t("widgets.overdue.allProjects")}
              </DropdownMenuItem>
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => setFilterProjectId(project.id)}
                >
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        {overdueTasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>{t("widgets.overdue.noOverdueTasks")}</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onSelectProject?.(task.projectId)}
              >
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{getProjectName(task.projectId)}</span>
                    <span>•</span>
                    <span>
                      {t("widgets.overdue.due")}{" "}
                      {task.dueDate && format(parseISO(task.dueDate), "MMM d")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

export function DateWeatherWidget() {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");

  useEffect(() => {
    // Update date every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Using Open-Meteo API (free, no API key required)
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`
            );

            if (!response.ok) throw new Error("Failed to fetch weather");

            const data = await response.json();
            const weatherData: WeatherData = {
              temperature: Math.round(data.current.temperature_2m),
              condition: getWeatherCondition(data.current.weather_code),
              icon: getWeatherIcon(data.current.weather_code),
            };

            setWeather(weatherData);
            setLocationPermission("granted");

            // Cache the weather data
            localStorage.setItem("weatherData", JSON.stringify(weatherData));
            localStorage.setItem("weatherTimestamp", Date.now().toString());
          } catch (err) {
            setError("Failed to load weather");
            console.error("Weather fetch error:", err);
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          setError("Location access denied");
          setLocationPermission("denied");
          setIsLoading(false);
          console.error("Geolocation error:", err);
        }
      );
    };

    // Check if we have cached weather data
    const cachedWeather = localStorage.getItem("weatherData");
    const cachedTime = localStorage.getItem("weatherTimestamp");

    if (cachedWeather && cachedTime) {
      const timeDiff = Date.now() - parseInt(cachedTime);
      // Use cached data if it's less than 30 minutes old
      if (timeDiff < 30 * 60 * 1000) {
        setWeather(JSON.parse(cachedWeather));
        setLocationPermission("granted");
        return;
      }
    }

    // Request location and fetch weather
    if (navigator.geolocation) {
      navigator.permissions
        ?.query({ name: "geolocation" })
        .then((result) => {
          setLocationPermission(result.state);
          if (result.state === "granted") {
            fetchWeather();
          }
        })
        .catch(() => {
          // Fallback if permissions API is not available
          setLocationPermission("prompt");
        });
    }
  }, []);

  const handleEnableWeather = () => {
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Using Open-Meteo API (free, no API key required)
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`
          );

          if (!response.ok) throw new Error("Failed to fetch weather");

          const data = await response.json();
          const weatherData: WeatherData = {
            temperature: Math.round(data.current.temperature_2m),
            condition: getWeatherCondition(data.current.weather_code),
            icon: getWeatherIcon(data.current.weather_code),
          };

          setWeather(weatherData);
          setLocationPermission("granted");

          // Cache the weather data
          localStorage.setItem("weatherData", JSON.stringify(weatherData));
          localStorage.setItem("weatherTimestamp", Date.now().toString());
        } catch (err) {
          setError("Failed to load weather");
          console.error("Weather fetch error:", err);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError("Location access denied");
        setLocationPermission("denied");
        setIsLoading(false);
        console.error("Geolocation error:", err);
      }
    );
  };

  const getWeatherCondition = (code: number): string => {
    // WMO Weather interpretation codes
    if (code === 0) return "Clear";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 57) return "Drizzle";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    if (code <= 82) return "Rain Showers";
    if (code <= 86) return "Snow Showers";
    if (code <= 99) return "Thunderstorm";
    return "Unknown";
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return "sun";
    if (code <= 3) return "cloud";
    if (code <= 48) return "fog";
    if (code <= 57) return "drizzle";
    if (code <= 67) return "rain";
    if (code <= 77) return "snow";
    if (code <= 99) return "rain";
    return "cloud";
  };

  const WeatherIcon = ({ iconName }: { iconName: string }) => {
    const iconClass = "h-8 w-8";
    switch (iconName) {
      case "sun":
        return <Sun className={cn(iconClass, "text-yellow-500")} />;
      case "cloud":
        return <Cloud className={cn(iconClass, "text-gray-500")} />;
      case "rain":
        return <CloudRain className={cn(iconClass, "text-blue-500")} />;
      case "snow":
        return <CloudSnow className={cn(iconClass, "text-blue-300")} />;
      case "drizzle":
        return <CloudDrizzle className={cn(iconClass, "text-blue-400")} />;
      case "fog":
        return <CloudFog className={cn(iconClass, "text-gray-400")} />;
      default:
        return <Wind className={cn(iconClass, "text-gray-500")} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("widgets.dateWeather.title")}</CardTitle>
        <CardDescription>
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {locationPermission === "prompt" && (
          <div className="text-center py-4">
            <Button onClick={handleEnableWeather} variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              {t("widgets.dateWeather.enableWeather")}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {t("widgets.dateWeather.allowLocation")}
            </p>
          </div>
        )}

        {locationPermission === "denied" && (
          <div className="text-center py-4 text-muted-foreground">
            <EyeOff className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">{t("widgets.dateWeather.locationDenied")}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
          </div>
        )}

        {error && !weather && (
          <div className="text-center py-4 text-destructive">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {weather && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WeatherIcon iconName={weather.icon} />
              <div>
                <p className="text-2xl font-bold">{weather.temperature}°C</p>
                <p className="text-sm text-muted-foreground">
                  {weather.condition}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
