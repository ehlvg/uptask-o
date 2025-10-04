import { TabBar, TabBarItem, TabBarLabel } from "@/components/ui/tab-bar";
import { Home, Search, Settings2, User, CheckSquare } from "lucide-react";

interface MobileTabBarProps {
  currentView: "dashboard" | "project";
  selectedTaskCount: number;
  onNavigateDashboard: () => void;
  onOpenSearch: () => void;
  onOpenSelection: () => void;
  onOpenSettings: () => void;
  onOpenUser: () => void;
}

export default function MobileTabBar({
  currentView,
  selectedTaskCount,
  onNavigateDashboard,
  onOpenSearch,
  onOpenSelection,
  onOpenSettings,
  onOpenUser,
}: MobileTabBarProps) {
  return (
    <TabBar>
      <TabBarItem
        active={currentView === "dashboard"}
        onClick={onNavigateDashboard}
      >
        <Home className="h-6 w-6" />
        <TabBarLabel>Home</TabBarLabel>
      </TabBarItem>

      <TabBarItem onClick={onOpenSearch}>
        <Search className="h-6 w-6" />
        <TabBarLabel>Search</TabBarLabel>
      </TabBarItem>

      {selectedTaskCount > 0 ? (
        <TabBarItem onClick={onOpenSelection}>
          <div className="relative">
            <CheckSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {selectedTaskCount}
            </span>
          </div>
          <TabBarLabel>Selected</TabBarLabel>
        </TabBarItem>
      ) : (
        <TabBarItem onClick={onOpenSettings}>
          <Settings2 className="h-6 w-6" />
          <TabBarLabel>Settings</TabBarLabel>
        </TabBarItem>
      )}

      <TabBarItem onClick={onOpenUser}>
        <User className="h-6 w-6" />
        <TabBarLabel>Account</TabBarLabel>
      </TabBarItem>
    </TabBar>
  );
}
