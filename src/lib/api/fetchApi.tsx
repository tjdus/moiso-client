import apiClient from "./apiClient";
import {
  TeamDTO,
  ProjectDTO,
  TaskDTO,
  TaskAssignmentDTO,
  ProjectMemberDTO,
  TeamMemberDTO,
  CategoryNameDTO,
  TagDTO,
  TeamGroupDTO,
  TeamGroupMemberDTO,
  TaskTagDTO,
  TeamDetailDTO,
  ProjectDetailDTO,
  TaskDetailDTO,
} from "./interface/fetchDTOs";
import { PaginationResponse } from "./interface/common";

export async function fetchTeamList({
  searchQuery,
  page,
  pageSize,
  name,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  name?: string;
}) {
  return apiClient.get<PaginationResponse<TeamDTO>>(`/api/teams`, {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(name && { name }),
    },
    withAuth: true,
  });
}

export async function fetchProjectList({
  searchQuery,
  page,
  pageSize,
  name,
  teamId,
  status,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  name?: string;
  teamId?: string;
  status?: string;
}) {
  return apiClient.get<PaginationResponse<ProjectDTO>>("/api/projects", {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(name && { name }),
      ...(teamId && { team: teamId }),
      ...(status && { status }),
    },
    withAuth: true,
  });
}

export async function fetchTaskList({
  searchQuery,
  page,
  pageSize,
  projectId,
  status,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  projectId?: string;
  status?: string;
}) {
  return apiClient.get<PaginationResponse<TaskDTO>>(`/api/tasks`, {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(projectId && { project: projectId }),
      ...(status && { status }),
    },
    withAuth: true,
  });
}

export async function fetchTagList({
  searchQuery,
  page,
  pageSize,
  name,
  projectId,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  name?: string;
  projectId?: string;
}) {
  return apiClient.get<PaginationResponse<TagDTO>>(`/api/tags`, {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(name && { name }),
      ...(projectId && { project: projectId }),
    },
    withAuth: true,
  });
}

export async function fetchCategoryList({
  searchQuery,
  page,
  pageSize,
  name,
  teamId,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  name?: string;
  teamId?: string;
}) {
  return apiClient.get<PaginationResponse<CategoryNameDTO>>(`/api/categories`, {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(name && { name }),
      ...(teamId && { team: teamId }),
    },
    withAuth: true,
  });
}

export async function fetchTeamMemberList({
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
  return apiClient.get<PaginationResponse<TeamMemberDTO>>(`/api/team_members`, {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(memberId && { member: memberId }),
      ...(teamId && { team: teamId }),
    },
    withAuth: true,
  });
}

export async function fetchTeamGroupList({
  searchQuery,
  page,
  pageSize,
  name,
  teamId,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  name?: string;
  teamId?: string;
}) {
  return apiClient.get<PaginationResponse<TeamGroupDTO>>(`/api/team_groups`, {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(name && { name }),
      ...(teamId && { team: teamId }),
    },
    withAuth: true,
  });
}

export async function fetchTeamGroupMemberList({
  searchQuery,
  page,
  pageSize,
  memberId,
  teamMemberId,
  teamGroupId,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  memberId?: string;
  teamMemberId?: string;
  teamGroupId?: string;
}) {
  return apiClient.get<PaginationResponse<TeamGroupMemberDTO>>(
    `/api/team_group_members`,
    {
      params: {
        ...(searchQuery && { search: searchQuery }),
        ...(page && { page }),
        ...(pageSize && { page_size: pageSize }),
        ...(memberId && { member: memberId }),
        ...(teamMemberId && { team_member: teamMemberId }),
        ...(teamGroupId && { team_group: teamGroupId }),
      },
      withAuth: true,
    }
  );
}

export async function fetchProjectMemberList({
  searchQuery,
  page,
  pageSize,
  memberId,
  projectId,
  teamId,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  memberId?: string;
  projectId?: string;
  teamId?: string;
}) {
  return apiClient.get<PaginationResponse<ProjectMemberDTO>>(
    `/api/project_members`,
    {
      params: {
        ...(searchQuery && { search: searchQuery }),
        ...(page && { page }),
        ...(pageSize && { page_size: pageSize }),
        ...(memberId && { member: memberId }),
        ...(projectId && { project: projectId }),
        ...(teamId && { team: teamId }),
      },
      withAuth: true,
    }
  );
}

export async function fetchTaskAssignmentList({
  searchQuery,
  page,
  pageSize,
  memberId,
  taskId,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  memberId?: string;
  taskId?: string;
}) {
  return apiClient.get<PaginationResponse<TaskAssignmentDTO>>(
    `/api/task_assignments`,
    {
      params: {
        ...(searchQuery && { search: searchQuery }),
        ...(page && { page }),
        ...(pageSize && { page_size: pageSize }),
        ...(memberId && { member: memberId }),
        ...(taskId && { task: taskId }),
      },
      withAuth: true,
    }
  );
}

export async function fetchTaskTagList({
  searchQuery,
  page,
  pageSize,
  taskId,
  tagId,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  taskId?: string;
  tagId?: string;
}) {
  return apiClient.get<PaginationResponse<TaskTagDTO>>(`/api/task_tags`, {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(taskId && { task: taskId }),
      ...(tagId && { tag: tagId }),
    },
    withAuth: true,
  });
}

export async function fetchMyTeamMemberList({
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
  return apiClient.get<PaginationResponse<TeamMemberDTO>>(
    `/api/my/team_members`,
    {
      params: {
        ...(searchQuery && { search: searchQuery }),
        ...(page && { page }),
        ...(pageSize && { page_size: pageSize }),
        ...(teamId && { team: teamId }),
      },
      withAuth: true,
    }
  );
}

export async function fetchMyTaskAssignmentList({
  searchQuery,
  page,
  pageSize,
  taskId,
  status,
  taskEndAtBefore,
  taskEndAtAfter,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  taskId?: string;
  status?: string;
  taskEndAtBefore?: string;
  taskEndAtAfter?: string;
}) {
  return apiClient.get<PaginationResponse<TaskAssignmentDTO>>(
    `/api/my/task_assignments`,
    {
      params: {
        ...(searchQuery && { search: searchQuery }),
        ...(page && { page }),
        ...(pageSize && { page_size: pageSize }),
        ...(taskId && { task: taskId }),
        ...(status && { status }),
        ...(taskEndAtBefore && { task_end_at_before: taskEndAtBefore }),
        ...(taskEndAtAfter && { task_end_at_after: taskEndAtAfter }),
      },
      withAuth: true,
    }
  );
}

export async function fetchMyProjectMemberList({
  searchQuery,
  page,
  pageSize,
  projectId,
  status,
  teamId,
  role,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  projectId?: string;
  status?: string;
  teamId?: string;
  role?: string;
}) {
  return apiClient.get<PaginationResponse<ProjectMemberDTO>>(
    `/api/my/project_members`,
    {
      params: {
        ...(searchQuery && { search: searchQuery }),
        ...(page && { page }),
        ...(pageSize && { page_size: pageSize }),
        ...(projectId && { project: projectId }),
        ...(status && { status }),
        ...(teamId && { team: teamId }),
        ...(role && { role }),
      },
      withAuth: true,
    }
  );
}

export async function fetchMyProjectMemberDetail(projectId: string) {
  return apiClient.get<ProjectMemberDTO>(
    `/api/my/project_member/${projectId}`,
    {
      withAuth: true,
    }
  );
}

export async function fetchTeamDetail(teamId: string) {
  return apiClient.get<TeamDetailDTO>(`/api/teams/${teamId}`, {
    withAuth: true,
  });
}

export async function fetchProjectDetail(projectId: string) {
  return apiClient.get<ProjectDetailDTO>(`/api/projects/${projectId}`, {
    withAuth: true,
  });
}

export async function fetchTaskDetail(taskId: string) {
  return apiClient.get<TaskDetailDTO>(`/api/tasks/${taskId}`, {
    withAuth: true,
  });
}

export async function fetchTeamMemberDetail(teamMemberId: string) {
  return apiClient.get<TeamMemberDTO>(`/api/team_members/${teamMemberId}`, {
    withAuth: true,
  });
}

export async function fetchTeamGroupDetail(teamGroupId: string) {
  return apiClient.get<TeamGroupDTO>(`/api/team_groups/${teamGroupId}`, {
    withAuth: true,
  });
}

export async function fetchTeamGroupMemberDetail(teamGroupMemberId: string) {
  return apiClient.get<TeamGroupMemberDTO>(
    `/api/team_group_members/${teamGroupMemberId}`,
    {
      withAuth: true,
    }
  );
}

export async function fetchProjectMemberDetail(projectMemberId: string) {
  return apiClient.get<ProjectMemberDTO>(
    `/api/project_members/${projectMemberId}`,
    {
      withAuth: true,
    }
  );
}
