export interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

export interface TaskResponse {
  count: number;
  next: string | null;
  previous: string | null;
  result: Task[];
}
