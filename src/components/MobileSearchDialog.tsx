import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, FolderInput } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import type { Task, Project } from "@/types/tasks";

interface MobileSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

export default function MobileSearchDialog({
  open,
  onOpenChange,
  tasks,
  projects,
  onSelectProject,
}: MobileSearchDialogProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { tasks: [], projects: [] };

    const query = searchQuery.toLowerCase();
    const matchedTasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
    );
    const matchedProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(query)
    );

    return {
      tasks: matchedTasks.slice(0, 10),
      projects: matchedProjects.slice(0, 5),
    };
  }, [searchQuery, tasks, projects]);

  const handleClose = () => {
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleSelectProject = (projectId: string) => {
    onSelectProject(projectId);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-full sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("search.title")}</DialogTitle>
          <DialogDescription>{t("search.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={t("search.placeholder") as string}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base h-12"
          />

          <div className="max-h-[50vh] overflow-y-auto space-y-4">
            {searchQuery.trim() && (
              <>
                {searchResults.projects.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                      {t("search.projects")}
                    </div>
                    <div className="space-y-2">
                      {searchResults.projects.map((project) => (
                        <Button
                          key={project.id}
                          variant="ghost"
                          className="w-full justify-start h-14 text-base"
                          onClick={() => handleSelectProject(project.id)}
                        >
                          <FolderInput className="mr-3 h-5 w-5" />
                          {project.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.tasks.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                      {t("search.tasks")}
                    </div>
                    <div className="space-y-2">
                      {searchResults.tasks.map((task) => {
                        const project = projects.find(
                          (p) => p.id === task.projectId
                        );
                        return (
                          <Button
                            key={task.id}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start flex-col items-start h-auto py-3 px-4",
                              task.completed && "opacity-60"
                            )}
                            onClick={() => handleSelectProject(task.projectId)}
                          >
                            <div className="flex items-center gap-3 w-full">
                              {task.completed ? (
                                <CheckSquare className="h-5 w-5 shrink-0" />
                              ) : (
                                <Square className="h-5 w-5 shrink-0" />
                              )}
                              <span
                                className={cn(
                                  "text-base",
                                  task.completed && "line-through"
                                )}
                              >
                                {task.title}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground ml-8">
                              {t("search.in")}{" "}
                              {project?.name || t("userDialog.unknown")}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {searchResults.projects.length === 0 &&
                  searchResults.tasks.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      {t("search.noResults")}
                    </div>
                  )}
              </>
            )}

            {!searchQuery.trim() && (
              <div className="text-center py-12 text-muted-foreground">
                {t("search.startTyping")}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
