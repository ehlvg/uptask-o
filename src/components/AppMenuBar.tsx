import { useState, useMemo } from "react";
import type { Task, Project } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Search,
  User,
  Trash,
  FolderInput,
  LogOut,
  CheckSquare,
  Square,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import SettingsDialog from "./SettingsDialog";

interface AppMenuBarProps {
  selectedTaskIds: Set<string>;
  tasks: Task[];
  projects: Project[];
  onMoveSelected: (projectId: string) => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  onSelectProject: (projectId: string) => void;
}

export default function AppMenuBar({
  selectedTaskIds,
  tasks,
  projects,
  onMoveSelected,
  onDeleteSelected,
  onClearSelection,
  onSelectProject,
}: AppMenuBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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

  return (
    <>
      <Menubar className="border-b rounded-none px-2 lg:px-4 menubar border-t-0">
        <MenubarMenu>
          <MenubarTrigger className="font-bold">uptask</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setShowUserDialog(true)}>
              <User className="mr-2 h-4 w-4" />
              User Info
            </MenubarItem>
            <MenubarItem onClick={() => setShowSettings(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {selectedTaskIds.size > 0 && (
          <MenubarMenu>
            <MenubarTrigger>
              <CheckSquare className="mr-2 h-4 w-4" />
              {selectedTaskIds.size} Selected
            </MenubarTrigger>
            <MenubarContent>
              <MenubarSub>
                <MenubarSubTrigger>
                  <FolderInput className="mr-2 h-4 w-4" />
                  Move to Project
                </MenubarSubTrigger>
                <MenubarSubContent>
                  {projects.map((project) => (
                    <MenubarItem
                      key={project.id}
                      onClick={() => onMoveSelected(project.id)}
                    >
                      {project.name}
                    </MenubarItem>
                  ))}
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem
                onClick={onDeleteSelected}
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Selected
              </MenubarItem>
              <MenubarItem onClick={onClearSelection}>
                <Square className="mr-2 h-4 w-4" />
                Clear Selection
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        )}

        <MenubarMenu>
          <MenubarTrigger onClick={() => setShowSearch(true)}>
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      {/* User Info Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Information</DialogTitle>
            <DialogDescription>Your account details</DialogDescription>
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
                Name
              </div>
              <div className="text-base">{user?.name || "Not provided"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Email
              </div>
              <div className="text-base">{user?.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Member since
              </div>
              <div className="text-base">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </div>
            </div>
            <div className="pt-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>Search for tasks and projects</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="text-base"
            />

            <div className="max-h-[400px] overflow-y-auto space-y-4">
              {searchQuery.trim() && (
                <>
                  {searchResults.projects.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                        Projects
                      </div>
                      <div className="space-y-1">
                        {searchResults.projects.map((project) => (
                          <Button
                            key={project.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              onSelectProject(project.id);
                              setShowSearch(false);
                              setSearchQuery("");
                            }}
                          >
                            <FolderInput className="mr-2 h-4 w-4" />
                            {project.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.tasks.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                        Tasks
                      </div>
                      <div className="space-y-1">
                        {searchResults.tasks.map((task) => {
                          const project = projects.find(
                            (p) => p.id === task.projectId
                          );
                          return (
                            <Button
                              key={task.id}
                              variant="ghost"
                              className={cn(
                                "w-full justify-start flex-col items-start h-auto py-2",
                                task.completed && "opacity-60"
                              )}
                              onClick={() => {
                                onSelectProject(task.projectId);
                                setShowSearch(false);
                                setSearchQuery("");
                              }}
                            >
                              <div className="flex items-center gap-2 w-full">
                                {task.completed ? (
                                  <CheckSquare className="h-4 w-4 shrink-0" />
                                ) : (
                                  <Square className="h-4 w-4 shrink-0" />
                                )}
                                <span
                                  className={cn(
                                    task.completed && "line-through"
                                  )}
                                >
                                  {task.title}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground ml-6">
                                in {project?.name || "Unknown"}
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {searchResults.projects.length === 0 &&
                    searchResults.tasks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No results found
                      </div>
                    )}
                </>
              )}

              {!searchQuery.trim() && (
                <div className="text-center py-8 text-muted-foreground">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
    </>
  );
}
