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
  TaskAssignmentDTO,
  MemberDTO,
  TeamMemberDetailDTO,
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

export async function fetchProjects({
  searchQuery,
  page,
  pageSize,
  teamId,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  teamId?: string;
}) {
  return apiClient.get<PaginationResponse<ProjectDTO>>(`/api/projects/`, {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(teamId && { team: teamId }),
    },
    withAuth: true,
  });
}

export async function fetchProjectMembers({
  searchQuery,
  page,
  pageSize,
  memberId,
  teamId,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  memberId?: string;
  teamId?: string;
}) {
  return apiClient.get<PaginationResponse<ProjectMemberDTO>>(
    `/api/project_members/`,
    {
      params: {
        ...(searchQuery && { search: searchQuery }),
        ...(page && { page }),
        ...(pageSize && { page_size: pageSize }),
        ...(memberId && { member: memberId }),
        ...(teamId && { team: teamId }),
      },
      withAuth: true,
    }
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
  searchQuery: string,
  page: number,
  pageSize: number
) {
  return apiClient.get<PaginationResponse<TaskDTO>>(`/api/tasks`, {
    params: {
      project: projectId,
      page,
      page_size: pageSize,
      search: searchQuery,
    },
    withAuth: true,
  });
}

export async function fetchTaskAssignmentsByTaskId(taskId: string) {
  return apiClient.get<PaginationResponse<TaskAssignmentDTO>>(
    `/api/task_assignments/`,
    {
      params: {
        task: taskId,
      },
      withAuth: true,
    }
  );
}

export async function fetchMyTaskAssignments(taskId?: string) {
  return apiClient.get<PaginationResponse<TaskAssignmentDTO>>(
    `/api/task_assignments/`,
    {
      params: taskId ? { task: taskId } : {},
      withAuth: true,
    }
  );
}

export async function fetchTeamMembers(
  teamId: string,
  page: number,
  page_size: number
) {
  return apiClient.get<PaginationResponse<TeamMemberDTO>>(
    `/api/team_members/`,
    {
      params: { team: teamId, page, page_size },
      withAuth: true,
    }
  );
}

export async function fetchProjectMembersAll(projectId: string) {
  return apiClient.get<PaginationResponse<ProjectMemberDTO>>(
    `/api/project_members/`,
    {
      params: {
        project: projectId,
      },
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

export async function fetchMemberDetail(memberId: string) {
  return apiClient.get<MemberDTO>(`/api/members/${memberId}/`, {
    withAuth: true,
  });
}

export async function fetchTeamMemberDetail({
  memberId,
  teamId,
  page,
  pageSize,
}: {
  memberId?: string;
  teamId: string;
  page?: number;
  pageSize?: number;
}) {
  return apiClient.get<PaginationResponse<TeamMemberDetailDTO>>(
    `/api/team_member_details/${teamId}/`,
    {
      params: {
        ...(memberId && { member: memberId }),
        ...(page && { page }),
        ...(pageSize && { page_size: pageSize }),
      },
      withAuth: true,
    }
  );
}
