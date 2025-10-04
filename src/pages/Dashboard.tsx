import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTaskManager } from "@/hooks/useTaskManager";
import { useDashboardSettings } from "@/hooks/useDashboardSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import AppMenuBar from "@/components/AppMenuBar";
import MobileTabBar from "@/components/MobileTabBar";
import MobileSelectionSheet from "@/components/MobileSelectionSheet";
import MobileSearchDialog from "@/components/MobileSearchDialog";
import SettingsDialog from "@/components/SettingsDialog";
import ProjectList from "@/components/ProjectList";
import TaskList from "@/components/TaskList";
import {
  GreetingWidget,
  TaskStatsWidget,
  OverdueTasksWidget,
  DateWeatherWidget,
} from "@/components/DashboardWidgets";
import {
  Menu,
  LayoutDashboard,
  Settings2,
  Eye,
  EyeOff,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<"dashboard" | "project">("dashboard");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showSelectionSheet, setShowSelectionSheet] = useState(false);
  const { widgets, toggleWidget, resetWidgets } = useDashboardSettings();

  const {
    tasks,
    projects,
    isLoading,
    selectedProjectId,
    setSelectedProjectId,
    selectedTaskIds,
    activeTasks,
    completedTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTasksToProject,
    deleteTasks,
    addProject,
    updateProject,
    deleteProject,
    toggleTaskSelection,
    selectTaskRange,
    clearSelection,
  } = useTaskManager(user?.id);

  const handleMoveSelected = (projectId: string) => {
    moveTasksToProject(Array.from(selectedTaskIds), projectId);
  };

  const handleDeleteSelected = () => {
    deleteTasks(Array.from(selectedTaskIds));
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setView("project");
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Desktop Menu Bar */}
      {!isMobile && (
        <AppMenuBar
          selectedTaskIds={selectedTaskIds}
          tasks={tasks}
          projects={projects}
          onMoveSelected={handleMoveSelected}
          onDeleteSelected={handleDeleteSelected}
          onClearSelection={clearSelection}
          onSelectProject={handleSelectProject}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 border-r flex-col overflow-hidden">
          <div className="p-4 border-b">
            <Button
              variant={view === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setView("dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t("dashboard.title")}
            </Button>
          </div>
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={handleSelectProject}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
          />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72 pt-8">
            <div className="p-5 border-b">
              <Button
                variant={view === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start h-12 text-base"
                onClick={() => {
                  setView("dashboard");
                  setSidebarOpen(false);
                }}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                {t("dashboard.title")}
              </Button>
            </div>
            <ProjectList
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={handleSelectProject}
              onAddProject={addProject}
              onUpdateProject={updateProject}
              onDeleteProject={deleteProject}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main
          className={`flex-1 flex flex-col overflow-hidden ${
            isMobile ? "pb-16" : ""
          }`}
        >
          {view === "dashboard" ? (
            <>
              {/* Dashboard Header - Mobile: Fixed breadcrumb bar, Desktop: Static header */}
              <div className="fixed md:static top-0 left-0 right-0 z-50 md:z-auto bg-background/95 md:bg-background backdrop-blur md:backdrop-blur-none supports-[backdrop-filter]:bg-background/80 md:supports-[backdrop-filter]:bg-background border-b px-5 py-4 md:px-6 md:py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden shrink-0 h-11 w-11"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 md:h-10 md:w-10"
                    >
                      <Settings2 className="h-6 w-6 md:h-5 md:w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {t("widgetSettings.title")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {widgets.map((widget) => (
                      <DropdownMenuItem
                        key={widget.id}
                        onClick={() => toggleWidget(widget.id)}
                      >
                        {widget.visible ? (
                          <Eye className="mr-2 h-4 w-4" />
                        ) : (
                          <EyeOff className="mr-2 h-4 w-4" />
                        )}
                        {t(`widgetSettings.${widget.id}`)}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={resetWidgets}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      {t("widgetSettings.resetToDefault")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 overflow-y-auto pt-20 md:pt-0 pb-20 md:pb-0">
                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {widgets.find((w) => w.id === "greeting")?.visible && (
                      <GreetingWidget userName={user?.name} />
                    )}
                    {widgets.find((w) => w.id === "stats")?.visible && (
                      <TaskStatsWidget tasks={tasks} />
                    )}
                    {widgets.find((w) => w.id === "dateWeather")?.visible && (
                      <DateWeatherWidget />
                    )}
                    {widgets.find((w) => w.id === "overdue")?.visible && (
                      <OverdueTasksWidget
                        tasks={tasks}
                        projects={projects}
                        onSelectProject={handleSelectProject}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Project Header - Mobile: Fixed breadcrumb bar, Desktop: Static header */}
              <div className="fixed md:static top-0 left-0 right-0 z-50 md:z-auto bg-background/95 md:bg-background backdrop-blur md:backdrop-blur-none supports-[backdrop-filter]:bg-background/80 md:supports-[backdrop-filter]:bg-background border-b px-5 py-4 md:px-6 md:py-4 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden shrink-0 h-11 w-11"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-bold truncate">
                  {currentProject?.name || t("dashboard.loading")}
                </h1>
              </div>

              {/* Task List */}
              <TaskList
                activeTasks={activeTasks}
                completedTasks={completedTasks}
                projects={projects}
                isLoading={isLoading}
                selectedTaskIds={selectedTaskIds}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onToggleCompletion={toggleTaskCompletion}
                onMoveTask={(taskId, projectId) =>
                  moveTasksToProject([taskId], projectId)
                }
                onToggleSelection={toggleTaskSelection}
                onRangeSelect={selectTaskRange}
              />
            </>
          )}
        </main>
      </div>

      {/* Mobile Tab Bar */}
      {isMobile && (
        <>
          <MobileTabBar
            currentView={view}
            selectedTaskCount={selectedTaskIds.size}
            onNavigateDashboard={() => setView("dashboard")}
            onOpenSearch={() => setShowSearch(true)}
            onOpenSelection={() => setShowSelectionSheet(true)}
            onOpenSettings={() => setShowSettingsDialog(true)}
            onOpenUser={() => setShowUserDialog(true)}
          />

          {/* Mobile Selection Sheet */}
          <MobileSelectionSheet
            open={showSelectionSheet}
            onOpenChange={setShowSelectionSheet}
            selectedCount={selectedTaskIds.size}
            projects={projects}
            onMoveSelected={handleMoveSelected}
            onDeleteSelected={handleDeleteSelected}
            onClearSelection={clearSelection}
          />

          {/* Mobile Search Dialog */}
          <MobileSearchDialog
            open={showSearch}
            onOpenChange={setShowSearch}
            tasks={tasks}
            projects={projects}
            onSelectProject={handleSelectProject}
          />

          {/* Mobile User Dialog */}
          <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
            <DialogContent className="max-w-[90vw] w-full">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {t("userDialog.account")}
                </DialogTitle>
                <DialogDescription>
                  {t("userDialog.description")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {user?.avatarUrl && (
                  <div className="flex justify-center">
                    <img
                      src={user.avatarUrl}
                      alt={user.name || "User"}
                      className="w-20 h-20 rounded-full"
                    />
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {t("userDialog.name")}
                  </div>
                  <div className="text-lg">
                    {user?.name || t("userDialog.notProvided")}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {t("userDialog.email")}
                  </div>
                  <div className="text-lg">{user?.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {t("userDialog.memberSince")}
                  </div>
                  <div className="text-lg">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : t("userDialog.unknown")}
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full h-12 text-base"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    {t("menuBar.logout")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Mobile Settings Dialog */}
          <SettingsDialog
            open={showSettingsDialog}
            onOpenChange={setShowSettingsDialog}
          />
        </>
      )}
    </div>
  );
}
