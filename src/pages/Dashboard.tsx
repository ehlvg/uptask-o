import { useAuth } from "@/contexts/AuthContext";
import { useTaskManager } from "@/hooks/useTaskManager";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AppMenuBar from "@/components/AppMenuBar";
import ProjectList from "@/components/ProjectList";
import TaskList from "@/components/TaskList";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    clearSelection,
  } = useTaskManager(user?.id);

  const handleMoveSelected = (projectId: string) => {
    moveTasksToProject(Array.from(selectedTaskIds), projectId);
  };

  const handleDeleteSelected = () => {
    deleteTasks(Array.from(selectedTaskIds));
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
        onSelectProject={(projectId) => {
          setSelectedProjectId(projectId);
          setSidebarOpen(false);
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 border-r flex-col overflow-hidden">
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
          />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-14 left-2 z-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <ProjectList
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={(projectId) => {
                setSelectedProjectId(projectId);
                setSidebarOpen(false);
              }}
              onAddProject={addProject}
              onUpdateProject={updateProject}
              onDeleteProject={deleteProject}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Project Header */}
          <div className="border-b px-4 py-3 md:px-6 md:py-4">
            <h1 className="text-xl md:text-2xl font-bold truncate ml-12 md:ml-0">
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
          />
        </main>
      </div>
    </div>
  );
}
