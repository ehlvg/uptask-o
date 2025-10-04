import { useState } from "react";
import type { Task, Project } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import TaskItem from "./TaskItem";
import { Plus, CalendarIcon, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskListProps {
  activeTasks: Task[];
  completedTasks: Task[];
  projects: Project[];
  isLoading: boolean;
  selectedTaskIds: Set<string>;
  onAddTask: (title: string, description?: string, dueDate?: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleCompletion: (taskId: string) => void;
  onMoveTask: (taskId: string, projectId: string) => void;
  onToggleSelection: (taskId: string) => void;
  onRangeSelect: (taskId: string) => void;
}

export default function TaskList({
  activeTasks,
  completedTasks,
  projects,
  isLoading,
  selectedTaskIds,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleCompletion,
  onMoveTask,
  onToggleSelection,
  onRangeSelect,
}: TaskListProps) {
  const isMobile = useIsMobile();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();
  const [showCompleted, setShowCompleted] = useState(true);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(
        newTaskTitle.trim(),
        newTaskDescription.trim() || undefined,
        newTaskDueDate?.toISOString()
      );
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate(undefined);
      setShowAddTask(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      {/* Main scrollable container - single scroll for everything */}
      <div className="absolute inset-0 overflow-y-auto pt-20 md:pt-0 pb-32 md:pb-20">
        {/* Active Tasks Section */}
        <div className="min-h-0">
          {activeTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
              <div className="text-muted-foreground mb-4">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-lg font-medium">No active tasks</p>
                <p className="text-sm mt-2">
                  Click the Add button to create your first task
                </p>
              </div>
            </div>
          )}

          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              projects={projects}
              isSelected={selectedTaskIds.has(task.id)}
              onToggleCompletion={onToggleCompletion}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
              onToggleSelection={onToggleSelection}
              onRangeSelect={onRangeSelect}
            />
          ))}
        </div>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <div className="border bg-muted/30 m-5 rounded-xl">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 px-4 py-3 h-auto"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="font-medium">
                Completed ({completedTasks.length})
              </span>
            </Button>

            {showCompleted && (
              <div>
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    projects={projects}
                    isSelected={selectedTaskIds.has(task.id)}
                    onToggleCompletion={onToggleCompletion}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                    onMove={onMoveTask}
                    onToggleSelection={onToggleSelection}
                    onRangeSelect={onRangeSelect}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Add Task Button */}
      <div className="fixed bottom-32 md:bottom-6 right-5 md:right-6 z-40">
        <Popover open={showAddTask} onOpenChange={setShowAddTask}>
          <PopoverTrigger asChild>
            <Button
              size={isMobile ? "lg" : "default"}
              className="h-14 md:h-11 px-6 md:px-4 gap-2 shadow-lg hover:shadow-xl transition-shadow text-base md:text-sm font-semibold"
            >
              <Plus className="h-6 w-6 md:h-5 md:w-5" />
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 md:w-96"
            align="end"
            side={isMobile ? "top" : "left"}
            sideOffset={isMobile ? 8 : 12}
          >
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">New Task</h4>
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title"
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleAddTask()
                  }
                  autoFocus
                  className="h-11 md:h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description (optional)</Label>
                <Input
                  id="task-description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Add description"
                  className="h-11 md:h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date (optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-11 md:h-10"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTaskDueDate
                        ? format(newTaskDueDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newTaskDueDate}
                      onSelect={setNewTaskDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddTask}
                  className="flex-1 h-11 md:h-10 text-base md:text-sm font-semibold"
                >
                  Add Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddTask(false);
                    setNewTaskTitle("");
                    setNewTaskDescription("");
                    setNewTaskDueDate(undefined);
                  }}
                  className="flex-1 h-11 md:h-10 text-base md:text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
