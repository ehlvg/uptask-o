import { useState, useEffect, useCallback } from "react";
import type { Task, Project } from "@/types/tasks";
import { supabase } from "@/lib/supabase";

export function useTaskManager(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("inbox");
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [lastSelectedTaskId, setLastSelectedTaskId] = useState<string | null>(
    null
  );

  // Helper function to map database row to Project
  const mapDbProject = (row: any): Project => ({
    id: row.id,
    name: row.name,
    icon: row.icon,
    userId: row.user_id,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

  // Helper function to map database row to Task
  const mapDbTask = (row: any): Task => ({
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed,
    dueDate: row.due_date,
    projectId: row.project_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
  });

  // Load projects and tasks from Supabase
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });

        if (projectsError) throw projectsError;

        const mappedProjects = (projectsData || []).map(mapDbProject);
        setProjects(mappedProjects);

        // Set initial selected project to inbox if it exists
        const inboxProject = mappedProjects.find((p) => p.isDefault);
        if (inboxProject) {
          setSelectedProjectId(inboxProject.id);
        }

        // Load tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (tasksError) throw tasksError;

        setTasks((tasksData || []).map(mapDbTask));
      } catch (error: any) {
        console.error("Error loading data:", error?.message || error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time changes for projects
    const projectsSubscription = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            setProjects((prev) => [...prev, mapDbProject(payload.new)]);
          } else if (payload.eventType === "UPDATE") {
            setProjects((prev) =>
              prev.map((p) =>
                p.id === payload.new.id ? mapDbProject(payload.new) : p
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProjects((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to real-time changes for tasks
    const tasksSubscription = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [mapDbTask(payload.new), ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === payload.new.id ? mapDbTask(payload.new) : t
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      projectsSubscription.unsubscribe();
      tasksSubscription.unsubscribe();
    };
  }, [userId]);

  // Task operations
  const addTask = useCallback(
    async (title: string, description?: string, dueDate?: string) => {
      if (!userId) return;

      try {
        const { error } = await supabase.from("tasks").insert({
          user_id: userId,
          project_id: selectedProjectId,
          title,
          description: description || null,
          due_date: dueDate || null,
          completed: false,
        });

        if (error) throw error;
      } catch (error: any) {
        console.error("Error adding task:", error?.message || error);
      }
    },
    [userId, selectedProjectId]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      try {
        // Map camelCase to snake_case for database
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined)
          dbUpdates.description = updates.description;
        if (updates.completed !== undefined)
          dbUpdates.completed = updates.completed;
        if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
        if (updates.projectId !== undefined)
          dbUpdates.project_id = updates.projectId;

        const { error } = await supabase
          .from("tasks")
          .update(dbUpdates)
          .eq("id", taskId);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error updating task:", error?.message || error);
      }
    },
    []
  );

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting task:", error?.message || error);
    }
  }, []);

  const toggleTaskCompletion = useCallback(
    async (taskId: string) => {
      try {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const { error } = await supabase
          .from("tasks")
          .update({ completed: !task.completed })
          .eq("id", taskId);

        if (error) throw error;
      } catch (error: any) {
        console.error(
          "Error toggling task completion:",
          error?.message || error
        );
      }
    },
    [tasks]
  );

  const moveTasksToProject = useCallback(
    async (taskIds: string[], projectId: string) => {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ project_id: projectId })
          .in("id", taskIds);

        if (error) throw error;

        setSelectedTaskIds(new Set());
      } catch (error: any) {
        console.error("Error moving tasks:", error?.message || error);
      }
    },
    []
  );

  const deleteTasks = useCallback(async (taskIds: string[]) => {
    try {
      const { error } = await supabase.from("tasks").delete().in("id", taskIds);

      if (error) throw error;

      setSelectedTaskIds(new Set());
    } catch (error: any) {
      console.error("Error deleting tasks:", error?.message || error);
    }
  }, []);

  // Project operations
  const addProject = useCallback(
    async (name: string, icon: string) => {
      if (!userId) return;

      try {
        const { error } = await supabase.from("projects").insert({
          user_id: userId,
          name,
          icon,
          is_default: false,
        });

        if (error) throw error;
      } catch (error: any) {
        console.error("Error adding project:", error?.message || error);
      }
    },
    [userId]
  );

  const updateProject = useCallback(
    async (projectId: string, updates: Partial<Project>) => {
      try {
        // Map camelCase to snake_case for database
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.icon !== undefined) dbUpdates.icon = updates.icon;

        const { error } = await supabase
          .from("projects")
          .update(dbUpdates)
          .eq("id", projectId);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error updating project:", error?.message || error);
      }
    },
    []
  );

  const deleteProject = useCallback(
    async (projectId: string, keepTasks: boolean) => {
      try {
        if (keepTasks) {
          // Move tasks to inbox
          const inboxProject = projects.find((p) => p.isDefault);
          if (inboxProject) {
            const { error: moveError } = await supabase
              .from("tasks")
              .update({ project_id: inboxProject.id })
              .eq("project_id", projectId);

            if (moveError) throw moveError;
          }
        } else {
          // Delete all tasks in the project
          const { error: deleteTasksError } = await supabase
            .from("tasks")
            .delete()
            .eq("project_id", projectId);

          if (deleteTasksError) throw deleteTasksError;
        }

        // Delete the project
        const { error } = await supabase
          .from("projects")
          .delete()
          .eq("id", projectId);

        if (error) throw error;

        if (selectedProjectId === projectId) {
          const inboxProject = projects.find((p) => p.isDefault);
          if (inboxProject) {
            setSelectedProjectId(inboxProject.id);
          }
        }
      } catch (error: any) {
        console.error("Error deleting project:", error?.message || error);
      }
    },
    [projects, selectedProjectId]
  );

  // Get tasks for current project
  const currentTasks = tasks.filter(
    (task) => task.projectId === selectedProjectId
  );
  const activeTasks = currentTasks.filter((task) => !task.completed);
  const completedTasks = currentTasks.filter((task) => task.completed);

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
    setLastSelectedTaskId(taskId);
  }, []);

  const selectTaskRange = useCallback(
    (taskId: string) => {
      if (!lastSelectedTaskId) {
        toggleTaskSelection(taskId);
        return;
      }

      const taskIds = currentTasks.map((t) => t.id);
      const startIndex = taskIds.indexOf(lastSelectedTaskId);
      const endIndex = taskIds.indexOf(taskId);

      if (startIndex === -1 || endIndex === -1) {
        toggleTaskSelection(taskId);
        return;
      }

      const [start, end] =
        startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
      const rangeIds = taskIds.slice(start, end + 1);

      setSelectedTaskIds((prev) => {
        const next = new Set(prev);
        rangeIds.forEach((id) => next.add(id));
        return next;
      });
      setLastSelectedTaskId(taskId);
    },
    [lastSelectedTaskId, currentTasks, toggleTaskSelection]
  );

  const clearSelection = useCallback(() => {
    setSelectedTaskIds(new Set());
    setLastSelectedTaskId(null);
  }, []);

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
    selectTaskRange,
    clearSelection,
  };
}
