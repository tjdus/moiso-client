import apiClient from "./apiClient";

export function deleteTask({ taskId }: { taskId: string }) {
  return apiClient.delete(`/api/tasks/${taskId}`, {
    withAuth: true,
  });
}

export function deleteTaskAssignment({
  assignmentId,
}: {
  assignmentId: string;
}) {
  return apiClient.delete(`/api/task_assignments/${assignmentId}`, {
    withAuth: true,
  });
}
