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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Active Tasks */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-0">
          {activeTasks.length === 0 && !showAddTask && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="text-muted-foreground mb-4">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-lg font-medium">No active tasks</p>
                <p className="text-sm mt-2">Add a task to get started</p>
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

        {/* Add Task Section */}
        <div className="p-4 border-t">
          <Popover open={showAddTask} onOpenChange={setShowAddTask}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <h4 className="font-medium">New Task</h4>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">
                    Description (optional)
                  </Label>
                  <Input
                    id="task-description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Add description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date (optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
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
                  <Button onClick={handleAddTask} className="flex-1">
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddTask(false);
                      setNewTaskTitle("");
                      setNewTaskDescription("");
                      setNewTaskDueDate(undefined);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="border-t bg-muted/30">
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
            <div className="max-h-[300px] overflow-y-auto">
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
  );
}
