import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash, FolderInput, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Project } from "@/types/tasks";

interface MobileSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  projects: Project[];
  onMoveSelected: (projectId: string) => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export default function MobileSelectionSheet({
  open,
  onOpenChange,
  selectedCount,
  projects,
  onMoveSelected,
  onDeleteSelected,
  onClearSelection,
}: MobileSelectionSheetProps) {
  const { t } = useLanguage();

  const handleMoveToProject = (projectId: string) => {
    onMoveSelected(projectId);
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDeleteSelected();
    onOpenChange(false);
  };

  const handleClear = () => {
    onClearSelection();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-auto max-h-[80vh] p-4 pb-12 rounded-2xl"
      >
        <SheetHeader>
          <SheetTitle className="text-lg">
            {selectedCount}{" "}
            {selectedCount !== 1
              ? t("widgets.overdue.tasks")
              : t("widgets.overdue.task")}{" "}
            {t("menuBar.selected")}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3 pt-6">
          {/* Move to Project */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FolderInput className="h-4 w-4" />
              {t("menuBar.moveToProject")}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {projects.map((project) => (
                <Button
                  key={project.id}
                  variant="outline"
                  className="justify-start h-12 text-base"
                  onClick={() => handleMoveToProject(project.id)}
                >
                  {project.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button
              variant="destructive"
              className="w-full h-12 text-base"
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-5 w-5" />
              {t("menuBar.deleteSelected")}
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              onClick={handleClear}
            >
              <X className="mr-2 h-5 w-5" />
              {t("menuBar.clearSelection")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
