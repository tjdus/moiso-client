export interface PaginationResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export type Role = "manager" | "viewer" | "editor";
export type Status = "not_started" | "in_progress" | "completed";
