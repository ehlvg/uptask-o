import { useAuth } from "@/contexts/AuthContext";
import { useTaskManager } from "@/hooks/useTaskManager";
import { useDashboardSettings } from "@/hooks/useDashboardSettings";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import AppMenuBar from "@/components/AppMenuBar";
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
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<"dashboard" | "project">("dashboard");
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

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Menu Bar */}
      <AppMenuBar
        selectedTaskIds={selectedTaskIds}
        tasks={tasks}
        projects={projects}
        onMoveSelected={handleMoveSelected}
        onDeleteSelected={handleDeleteSelected}
        onClearSelection={clearSelection}
        onSelectProject={handleSelectProject}
      />

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
              Dashboard
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
          <SheetContent side="left" className="p-0 w-64 pt-8">
            <div className="p-4 border-b">
              <Button
                variant={view === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setView("dashboard");
                  setSidebarOpen(false);
                }}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
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
        <main className="flex-1 flex flex-col overflow-hidden">
          {view === "dashboard" ? (
            <>
              {/* Dashboard Header */}
              <div className="border-b px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden shrink-0"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <h1 className="text-xl md:text-2xl font-bold md:min-h-[36px]">
                    Dashboard
                  </h1>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings2 className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Widget Visibility</DropdownMenuLabel>
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
                        {widget.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={resetWidgets}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
              {/* Project Header */}
              <div className="border-b px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden shrink-0"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl md:text-2xl font-bold truncate md:min-h-[36px]">
                  {currentProject?.name || "Loading..."}
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
    </div>
  );
}
