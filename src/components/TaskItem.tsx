import { useState } from "react";
import type { Task, Project } from "@/types/tasks";
import { useLanguage } from "@/contexts/LanguageContext";
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
import * as LucideIcons from "lucide-react";
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
  onRangeSelect: (taskId: string) => void;
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
  onRangeSelect,
}: TaskItemProps) {
  const { t } = useLanguage();
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
      <ContextMenuItem onClick={() => onToggleSelection(task.id)}>
        {isSelected ? (
          <>
            <LucideIcons.CheckSquare className="mr-2 h-4 w-4" />
            {t("taskItem.deselect")}
          </>
        ) : (
          <>
            <LucideIcons.Square className="mr-2 h-4 w-4" />
            {t("taskItem.select")}
          </>
        )}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => setIsEditing(true)}>
        <Edit className="mr-2 h-4 w-4" />
        {t("taskItem.edit")}
      </ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <FolderInput className="mr-2 h-4 w-4" />
          {t("taskItem.moveToProject")}
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
        {t("taskItem.delete")}
      </ContextMenuItem>
    </>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "group relative flex items-center gap-3 px-4 py-3 md:py-2 transition-all duration-300 cursor-pointer min-h-[60px] md:min-h-0",
            isAnimating &&
              !task.completed &&
              "translate-x-full opacity-0 blur-sm",
            isAnimating &&
              task.completed &&
              "-translate-x-full opacity-0 blur-sm",
            isSelected && "bg-accent/50",
            !isAnimating && "hover:bg-accent/30"
          )}
          onClick={(e) => {
            // Don't trigger selection if clicking on interactive elements
            const target = e.target as HTMLElement;
            if (
              target.closest("button") ||
              target.closest('[role="checkbox"]') ||
              target.closest("[data-radix-collection-item]")
            ) {
              return;
            }

            if (e.shiftKey) {
              e.preventDefault();
              onRangeSelect(task.id);
            } else if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              onToggleSelection(task.id);
            }
          }}
        >
          {/* Visual Selection Indicator */}
          {isSelected && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
          )}

          {/* Completion Checkbox */}
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleCheckboxChange}
            className={cn(
              "shrink-0 transition-all duration-200 h-5 w-5 md:h-4 md:w-4",
              isAnimating && "scale-125"
            )}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span
              className={cn(
                "truncate text-base md:text-sm",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </span>
            {task.description && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px] truncate">
                • {task.description}
              </span>
            )}
          </div>

          {task.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm md:text-xs shrink-0",
                new Date(task.dueDate) < new Date() && !task.completed
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4 md:h-3 md:w-3" />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          )}

          {/* Mobile & Desktop: Three-dot Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 md:h-8 md:w-8 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-5 w-5 md:h-4 md:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleSelection(task.id)}>
                {isSelected ? (
                  <>
                    <LucideIcons.CheckSquare className="mr-2 h-4 w-4" />
                    {t("taskItem.deselect")}
                  </>
                ) : (
                  <>
                    <LucideIcons.Square className="mr-2 h-4 w-4" />
                    {t("taskItem.select")}
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                {t("taskItem.edit")}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FolderInput className="mr-2 h-4 w-4" />
                  {t("taskItem.moveToProject")}
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
                {t("taskItem.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>{menuItems}</ContextMenuContent>

      {/* Edit Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-popover text-popover-foreground w-full max-w-md rounded-md border p-4 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h4 className="font-medium">{t("taskItem.editTask")}</h4>
              <div className="space-y-2">
                <Label htmlFor="task-title">{t("taskList.title")}</Label>
                <Input
                  id="task-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={t("taskList.titlePlaceholder") as string}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">
                  {t("taskList.description")}
                </Label>
                <Input
                  id="task-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder={t("taskList.descriptionPlaceholder") as string}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("taskList.dueDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editDueDate
                        ? format(editDueDate, "PPP")
                        : t("taskList.pickDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editDueDate}
                      onSelect={setEditDueDate}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 h-11 md:h-10 text-base md:text-sm"
                >
                  {t("taskItem.save")}
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
                  className="flex-1 h-11 md:h-10 text-base md:text-sm"
                >
                  {t("taskList.cancel")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ContextMenu>
  );
}
