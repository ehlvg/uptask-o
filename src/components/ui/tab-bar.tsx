import * as React from "react";
import { cn } from "@/lib/utils";

const TabBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed bottom-0 pt-2 left-0 right-0 z-50 flex items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
      "h-24 pb-safe",
      className
    )}
    {...props}
  />
));
TabBar.displayName = "TabBar";

const TabBarItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
  }
>(({ className, active, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
      "text-muted-foreground hover:text-foreground",
      active && "text-primary",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
TabBarItem.displayName = "TabBarItem";

const TabBarIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGSVGElement>
>(({ className, ...props }, ref) => (
  <svg ref={ref} className={cn("h-6 w-6", className)} {...props} />
));
TabBarIcon.displayName = "TabBarIcon";

const TabBarLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("text-xs font-medium", className)} {...props} />
));
TabBarLabel.displayName = "TabBarLabel";

export { TabBar, TabBarItem, TabBarIcon, TabBarLabel };
