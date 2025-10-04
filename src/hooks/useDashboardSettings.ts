import { useState, useEffect } from "react";
import type { DashboardWidget } from "@/components/DashboardWidgets";
import { defaultWidgets } from "@/components/DashboardWidgets";

const STORAGE_KEY = "uptask_dashboard_settings";

export function useDashboardSettings() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);

  useEffect(() => {
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
        setWidgets(merged);
      } catch (error) {
        console.error("Failed to parse dashboard settings:", error);
      }
    }
  }, []);

  useEffect(() => {
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
