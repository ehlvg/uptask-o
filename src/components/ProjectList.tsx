import { useState } from "react";
import type { Project } from "@/types/tasks";
import { ICONS } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as LucideIcons from "lucide-react";
import { Separator } from "./ui/separator";

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  onAddProject: (name: string, icon: string) => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
  onDeleteProject: (projectId: string, keepTasks: boolean) => void;
}

const IconComponent = ({
  iconName,
  className,
}: {
  iconName: string;
  className?: string;
}) => {
  const Icon =
    (LucideIcons as any)[
      iconName
        .split("-")
        .map((word, i) =>
          i === 0
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("")
    ] || LucideIcons.Folder;
  return <Icon className={className} />;
};

export default function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}: ProjectListProps) {
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectIcon, setNewProjectIcon] = useState("folder");

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const [deleteDialog, setDeleteDialog] = useState<{ project: Project } | null>(
    null
  );

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim(), newProjectIcon);
      setNewProjectName("");
      setNewProjectIcon("folder");
      setShowAddProject(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditIcon(project.icon);
  };

  const handleSaveEdit = () => {
    if (editingProject && editName.trim()) {
      onUpdateProject(editingProject.id, {
        name: editName.trim(),
        icon: editIcon,
      });
      setEditingProject(null);
    }
  };

  const ProjectMenuItem = ({ project }: { project: Project }) => {
    const menuItems = (
      <>
        <ContextMenuItem onClick={() => handleEditProject(project)}>
          <LucideIcons.Edit className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        {!project.isDefault && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => setDeleteDialog({ project })}
              className="text-destructive"
            >
              <LucideIcons.Trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </>
        )}
      </>
    );

    return (
      <>
        {/* Desktop: Context Menu */}
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Button
              variant={selectedProjectId === project.id ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 px-3 hidden md:flex"
              onClick={() => onSelectProject(project.id)}
            >
              <IconComponent
                iconName={project.icon}
                className="h-4 w-4 shrink-0 text-primary"
              />
              <span className="truncate">{project.name}</span>
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>{menuItems}</ContextMenuContent>
        </ContextMenu>

        {/* Mobile: With dropdown */}
        <div className="flex md:hidden items-center gap-1">
          <Button
            variant={selectedProjectId === project.id ? "secondary" : "ghost"}
            className="flex-1 justify-start gap-3 px-3"
            onClick={() => onSelectProject(project.id)}
          >
            <IconComponent
              iconName={project.icon}
              className="h-4 w-4 shrink-0"
            />
            <span className="truncate">{project.name}</span>
          </Button>
          {!project.isDefault && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                >
                  <LucideIcons.MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditProject(project)}>
                  <LucideIcons.Edit className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteDialog({ project })}
                  variant="destructive"
                >
                  <LucideIcons.Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
        Projects
      </div>

      {projects.map((project) => (
        <ProjectMenuItem key={project.id} project={project} />
      ))}

      <Separator className="my-2" />

      <Popover open={showAddProject} onOpenChange={setShowAddProject}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-3 mt-2"
          >
            <LucideIcons.Plus className="h-4 w-4" />
            Add Project
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">New Project</h4>
            <div className="space-y-2">
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map((icon) => (
                  <Button
                    key={icon.value}
                    variant={
                      newProjectIcon === icon.value ? "secondary" : "outline"
                    }
                    size="icon"
                    onClick={() => setNewProjectIcon(icon.value)}
                    title={icon.label}
                  >
                    <IconComponent iconName={icon.value} className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddProject} className="flex-1">
                Add
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddProject(false);
                  setNewProjectName("");
                  setNewProjectIcon("folder");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Edit Project Popover */}
      <Popover
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      >
        <PopoverTrigger asChild>
          <div className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">Edit Project</h4>
            <div className="space-y-2">
              <Label htmlFor="edit-project-name">Name</Label>
              <Input
                id="edit-project-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Project name"
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map((icon) => (
                  <Button
                    key={icon.value}
                    variant={editIcon === icon.value ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => setEditIcon(icon.value)}
                    title={icon.label}
                  >
                    <IconComponent iconName={icon.value} className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingProject(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Delete Project Dialog */}
      <Dialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              What would you like to do with the tasks in "
              {deleteDialog?.project.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (deleteDialog) {
                  onDeleteProject(deleteDialog.project.id, true);
                  setDeleteDialog(null);
                }
              }}
              className="w-full sm:w-auto"
            >
              Keep Tasks in Inbox
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDialog) {
                  onDeleteProject(deleteDialog.project.id, false);
                  setDeleteDialog(null);
                }
              }}
              className="w-full sm:w-auto"
            >
              Delete Tasks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
