import apiClient from "./apiClient";
import {
  TagDTO,
  TeamDTO,
  TeamDetailDTO,
  ProjectDTO,
  ProjectDetailDTO,
  TaskDetailDTO,
  TaskDTO,
  TeamMemberDTO,
  CategoryNameDTO,
  ProjectMemberDTO,
} from "../interface/fetchDTOs";
import { PaginationResponse } from "../interface/common";

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

export async function fetchTeamMembers(teamId: string) {
  return apiClient.get<PaginationResponse<TeamMemberDTO>>(
    `/api/team_members/`,
    {
      params: { team: teamId },
      withAuth: true,
    }
  );
}

export async function fetchProjectMembers(projectId: string) {
  return apiClient.get<PaginationResponse<ProjectMemberDTO>>(
    `/api/project_members/`,
    {
      params: { project: projectId },
      withAuth: true,
    }
  );
}

export async function fetchCategoriesByTeamId(teamId: string) {
  return apiClient.get<PaginationResponse<CategoryNameDTO>>(
    `/api/categories/`,
    {
      params: { teamId: teamId },
      withAuth: true,
    }
  );
}
export async function fetchTagsByProjectId(projectId: string) {
  return apiClient.get<PaginationResponse<TagDTO>>(`/api/tags/`, {
    params: { project: projectId },
    withAuth: true,
  });
}
