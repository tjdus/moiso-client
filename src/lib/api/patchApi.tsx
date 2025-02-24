import apiClient from "./apiClient";
import { TaskForm } from "../interface/form";

export async function updateTask({
  id,
  project,
  tags,
  members,
  title,
  description,
  status,
  start_at,
  end_at,
}: Partial<TaskForm>) {
  return apiClient.patch<Partial<TaskForm>, TaskForm>(`/api/tasks/${id}/`, {
    withAuth: true,
    body: {
      ...(project !== undefined && { project }),
      ...(tags !== undefined && { tags }),
      ...(members !== undefined && { members }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(start_at !== undefined && { start_at }),
      ...(end_at !== undefined && { end_at }),
    },
  });
}
