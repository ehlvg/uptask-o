export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  projectId: string;
  createdAt: string;
  userId: number;
}

export interface Project {
  id: string;
  name: string;
  icon: string;
  userId: number;
  isDefault?: boolean;
  createdAt: string;
}

export const ICONS = [
  { value: "inbox", label: "Inbox" },
  { value: "folder", label: "Folder" },
  { value: "briefcase", label: "Briefcase" },
  { value: "home", label: "Home" },
  { value: "shopping-cart", label: "Shopping" },
  { value: "heart", label: "Heart" },
  { value: "star", label: "Star" },
  { value: "bookmark", label: "Bookmark" },
  { value: "calendar", label: "Calendar" },
  { value: "file-text", label: "Document" },
  { value: "book", label: "Book" },
  { value: "coffee", label: "Coffee" },
  { value: "laptop", label: "Laptop" },
  { value: "music", label: "Music" },
  { value: "gamepad-2", label: "Gaming" },
  { value: "dumbbell", label: "Fitness" },
  { value: "plane", label: "Travel" },
  { value: "graduation-cap", label: "Education" },
];
