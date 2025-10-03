import { useState, useEffect, useCallback } from "react";
import type { Task, Project } from "@/types/tasks";

const STORAGE_KEY_TASKS = "uptask_tasks";
const STORAGE_KEY_PROJECTS = "uptask_projects";

export function useTaskManager(userId: number | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("inbox");
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );

  // Initialize data from localStorage
  useEffect(() => {
    if (!userId) return;

    const loadData = () => {
      try {
        // Simulate loading delay
        setTimeout(() => {
          const storedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
          const storedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);

          if (storedTasks) {
            const allTasks: Task[] = JSON.parse(storedTasks);
            setTasks(allTasks.filter((t) => t.userId === userId));
          }

          if (storedProjects) {
            const allProjects: Project[] = JSON.parse(storedProjects);
            const userProjects = allProjects.filter((p) => p.userId === userId);

            // Ensure inbox exists
            const hasInbox = userProjects.some((p) => p.id === "inbox");
            if (!hasInbox) {
              const inbox: Project = {
                id: "inbox",
                name: "Inbox",
                icon: "inbox",
                userId,
                isDefault: true,
                createdAt: new Date().toISOString(),
              };
              userProjects.unshift(inbox);
              const updatedProjects = [
                ...allProjects.filter((p) => p.userId !== userId),
                ...userProjects,
              ];
              localStorage.setItem(
                STORAGE_KEY_PROJECTS,
                JSON.stringify(updatedProjects)
              );
            }

            setProjects(userProjects);
          } else {
            // Create default inbox
            const inbox: Project = {
              id: "inbox",
              name: "Inbox",
              icon: "inbox",
              userId,
              isDefault: true,
              createdAt: new Date().toISOString(),
            };
            setProjects([inbox]);
            localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify([inbox]));
          }

          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]);

  // Save tasks to localStorage
  const saveTasks = useCallback(
    (newTasks: Task[]) => {
      try {
        const storedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
        const allTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
        const otherUsersTasks = allTasks.filter((t) => t.userId !== userId);
        const updatedTasks = [...otherUsersTasks, ...newTasks];
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updatedTasks));
        setTasks(newTasks);
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    },
    [userId]
  );

  // Save projects to localStorage
  const saveProjects = useCallback(
    (newProjects: Project[]) => {
      try {
        const storedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
        const allProjects: Project[] = storedProjects
          ? JSON.parse(storedProjects)
          : [];
        const otherUsersProjects = allProjects.filter(
          (p) => p.userId !== userId
        );
        const updatedProjects = [...otherUsersProjects, ...newProjects];
        localStorage.setItem(
          STORAGE_KEY_PROJECTS,
          JSON.stringify(updatedProjects)
        );
        setProjects(newProjects);
      } catch (error) {
        console.error("Error saving projects:", error);
      }
    },
    [userId]
  );

  // Task operations
  const addTask = useCallback(
    (title: string, description?: string, dueDate?: string) => {
      if (!userId) return;

      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        completed: false,
        dueDate,
        projectId: selectedProjectId,
        createdAt: new Date().toISOString(),
        userId,
      };

      saveTasks([...tasks, newTask]);
    },
    [tasks, selectedProjectId, userId, saveTasks]
  );

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      saveTasks(updatedTasks);
    },
    [tasks, saveTasks]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      saveTasks(tasks.filter((task) => task.id !== taskId));
    },
    [tasks, saveTasks]
  );

  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      saveTasks(updatedTasks);
    },
    [tasks, saveTasks]
  );

  const moveTasksToProject = useCallback(
    (taskIds: string[], projectId: string) => {
      const updatedTasks = tasks.map((task) =>
        taskIds.includes(task.id) ? { ...task, projectId } : task
      );
      saveTasks(updatedTasks);
      setSelectedTaskIds(new Set());
    },
    [tasks, saveTasks]
  );

  const deleteTasks = useCallback(
    (taskIds: string[]) => {
      saveTasks(tasks.filter((task) => !taskIds.includes(task.id)));
      setSelectedTaskIds(new Set());
    },
    [tasks, saveTasks]
  );

  // Project operations
  const addProject = useCallback(
    (name: string, icon: string) => {
      if (!userId) return;

      const newProject: Project = {
        id: Date.now().toString(),
        name,
        icon,
        userId,
        createdAt: new Date().toISOString(),
      };

      saveProjects([...projects, newProject]);
    },
    [projects, userId, saveProjects]
  );

  const updateProject = useCallback(
    (projectId: string, updates: Partial<Project>) => {
      const updatedProjects = projects.map((project) =>
        project.id === projectId ? { ...project, ...updates } : project
      );
      saveProjects(updatedProjects);
    },
    [projects, saveProjects]
  );

  const deleteProject = useCallback(
    (projectId: string, keepTasks: boolean) => {
      if (keepTasks) {
        // Move tasks to inbox
        const updatedTasks = tasks.map((task) =>
          task.projectId === projectId ? { ...task, projectId: "inbox" } : task
        );
        saveTasks(updatedTasks);
      } else {
        // Delete all tasks in the project
        saveTasks(tasks.filter((task) => task.projectId !== projectId));
      }

      saveProjects(projects.filter((project) => project.id !== projectId));

      if (selectedProjectId === projectId) {
        setSelectedProjectId("inbox");
      }
    },
    [projects, tasks, selectedProjectId, saveProjects, saveTasks]
  );

  // Selection operations
  const toggleTaskSelection = useCallback((taskId: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTaskIds(new Set());
  }, []);

  // Get tasks for current project
  const currentTasks = tasks.filter(
    (task) => task.projectId === selectedProjectId
  );
  const activeTasks = currentTasks.filter((task) => !task.completed);
  const completedTasks = currentTasks.filter((task) => task.completed);

  return {
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
  };
}
