import { useState } from "react";
import type { Task, Project } from "@/types/tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar as CalendarIcon,
  Edit,
  MoreVertical,
  Trash,
  FolderInput,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
  projects: Project[];
  isSelected: boolean;
  onToggleCompletion: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, projectId: string) => void;
  onToggleSelection: (taskId: string) => void;
}

export default function TaskItem({
  task,
  projects,
  isSelected,
  onToggleCompletion,
  onUpdate,
  onDelete,
  onMove,
  onToggleSelection,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckboxChange = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onToggleCompletion(task.id);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 200);
  };

  const handleSaveEdit = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription || undefined,
      dueDate: editDueDate?.toISOString(),
    });
    setIsEditing(false);
  };

  const menuItems = (
    <>
      <ContextMenuItem onClick={() => setIsEditing(true)}>
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <FolderInput className="mr-2 h-4 w-4" />
          Move to Project
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          {projects.map((project) => (
            <ContextMenuItem
              key={project.id}
              onClick={() => onMove(task.id, project.id)}
              disabled={project.id === task.projectId}
            >
              {project.name}
            </ContextMenuItem>
          ))}
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={() => onDelete(task.id)}
        className="text-destructive"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </ContextMenuItem>
    </>
  );

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-4 py-2 border-b transition-all duration-300",
        isAnimating && !task.completed && "translate-x-full opacity-0 blur-sm",
        isAnimating && task.completed && "-translate-x-full opacity-0 blur-sm",
        isSelected && "bg-accent/50",
        !isAnimating && "hover:bg-accent/30"
      )}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey) {
          onToggleSelection(task.id);
        }
      }}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleCheckboxChange}
        className={cn(
          "shrink-0 transition-all duration-200",
          isAnimating && "scale-125"
        )}
      />

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span
          className={cn(
            "truncate text-sm",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </span>
        {task.description && (
          <span className="text-xs text-muted-foreground truncate max-w-[200px] hidden md:inline">
            • {task.description}
          </span>
        )}
      </div>

      {task.dueDate && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs shrink-0",
            new Date(task.dueDate) < new Date() && !task.completed
              ? "text-destructive"
              : "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-3 w-3" />
          <span className="hidden sm:inline">
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        </div>
      )}

      {/* Desktop: Context Menu */}
      <ContextMenu>
        <ContextMenuTrigger className="hidden md:block absolute inset-0" />
        <ContextMenuContent>{menuItems}</ContextMenuContent>
      </ContextMenu>

      {/* Mobile: Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderInput className="mr-2 h-4 w-4" />
              Move to Project
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => onMove(task.id, project.id)}
                  disabled={project.id === task.projectId}
                >
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(task.id)}
            variant="destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Popover */}
      <Popover open={isEditing} onOpenChange={setIsEditing}>
        <PopoverTrigger asChild>
          <div className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">Edit Task</h4>
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description (optional)</Label>
              <Input
                id="task-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
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
                    {editDueDate ? format(editDueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editDueDate}
                    onSelect={setEditDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(task.title);
                  setEditDescription(task.description || "");
                  setEditDueDate(
                    task.dueDate ? new Date(task.dueDate) : undefined
                  );
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
  );
}
