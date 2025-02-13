import apiClient from "./apiClient";
import {
  TeamDTO,
  TeamDetailDTO,
  ProjectDTO,
  ProjectDetailDTO,
  TaskDetailDTO,
  TaskDTO,
} from "../interface/work";
import { PaginationResponse } from "../interface/core";

export async function fetchMyTeams() {
  return apiClient.get<TeamDTO[]>("/api/my/teams/", { withAuth: true });
}

export async function fetchTeamDetail(teamId: string) {
  return apiClient.get<TeamDetailDTO>(`/api/teams/${teamId}/`, {
    withAuth: true,
  });
}

export async function fetchProjectsByTeamId(teamId: string) {
  return apiClient.get<ProjectDTO[]>(
    `/api/projects?team=${encodeURIComponent(teamId)}`
  );
}

export async function fetchMembersByTeamId(teamId: string) {
  return apiClient.get<ProjectDTO[]>(
    `/api/projects?team=${encodeURIComponent(teamId)}`
  );
}

export async function fetchProjectDetail(projectId: string) {
  return apiClient.get<ProjectDetailDTO>(`/api/projects/${projectId}/`, {
    withAuth: true,
  });
}

export async function fetchTaskDetail(taskId: string) {
  return apiClient.get<TaskDetailDTO>(`/api/tasks/${taskId}/`, {
    withAuth: true,
  });
}

export async function fetchTasksByProjectId(
  projectId: string,
  page: number,
  pageSize: number
) {
  return apiClient.get<PaginationResponse<TaskDTO>>(`/api/tasks`, {
    params: { project: projectId, page, page_size: pageSize },
    withAuth: true,
  });
}
