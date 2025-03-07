import { String } from "lodash";
import apiClient from "./apiClient";

export function deleteTeam(id: string) {
  return apiClient.delete(`/api/teams/${id}`, {
    withAuth: true,
  });
}

export function deleteProject(id: string) {
  return apiClient.delete(`/api/projects/${id}`, {
    withAuth: true,
  });
}

export function deleteTag(id: string) {
  return apiClient.delete(`/api/tags/${id}`, {
    withAuth: true,
  });
}

export function deleteCategory(id: string) {
  return apiClient.delete(`/api/categories/${id}`, {
    withAuth: true,
  });
}

export function deleteTask(id: string) {
  return apiClient.delete(`/api/tasks/${id}`, {
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

export function deleteProjectMember(id: string) {
  return apiClient.delete(`/api/project_members/${id}`, {
    withAuth: true,
  });
}

export function deleteTeamMember(id: string) {
  return apiClient.delete(`/api/team_members/${id}`, {
    withAuth: true,
  });
}

export function deleteTeamGroup(id: string) {
  return apiClient.delete(`/api/team_groups/${id}`, {
    withAuth: true,
  });
}
