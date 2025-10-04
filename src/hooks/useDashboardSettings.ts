import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "uptask_dashboard_settings";

export interface DashboardWidget {
  id: string;
  name: string;
  visible: boolean;
}

export const defaultWidgets: DashboardWidget[] = [
  { id: "greeting", name: "Greeting", visible: true },
  { id: "stats", name: "Task Overview", visible: true },
  { id: "overdue", name: "Overdue Tasks", visible: true },
  { id: "dateWeather", name: "Date & Weather", visible: true },
];

export function useDashboardSettings() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    // Initialize state from localStorage on first render
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with default widgets to ensure all widgets are present
        const merged = defaultWidgets.map((defaultWidget) => {
          const savedWidget = parsed.find(
            (w: DashboardWidget) => w.id === defaultWidget.id
          );
          return savedWidget || defaultWidget;
        });
        return merged;
      } catch (error) {
        console.error("Failed to parse dashboard settings:", error);
      }
    }
    return defaultWidgets;
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip saving on initial mount to avoid overwriting with defaults
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const toggleWidget = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === widgetId
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  };

  const resetWidgets = () => {
    setWidgets(defaultWidgets);
  };

  return { widgets, toggleWidget, resetWidgets };
}
