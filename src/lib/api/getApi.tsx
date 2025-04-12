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
  EventListDTO,
  EventDTO,
} from "./interface/fetchDTOs";
import { PaginationResponse } from "./interface/common";

export async function getTeamList({
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

export async function getProjectList({
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

export async function getEventList({
  searchQuery,
  page,
  pageSize,
  teamId,
  location,
  is_private
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  teamId?: string;
  location?: string;
  is_private?: number;
}) {
  return apiClient.get<PaginationResponse<EventDTO>>("/api/events", {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(page && { page }),
      ...(pageSize && { page_size: pageSize }),
      ...(teamId && { team: teamId }),
      ...(location && { location }),
      ...(is_private && { is_private }),
    },
    withAuth: true,
  });
}

export async function getTaskList({
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

export async function getTagList({
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

export async function getCategoryList({
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

export async function getTeamMemberList({
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

export async function getTeamGroupList({
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

export async function getTeamGroupMemberList({
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

export async function getProjectMemberList({
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

export async function getTaskAssignmentList({
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

export async function getTaskTagList({
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

export async function getMyTeamMemberList({
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

export async function getMyTaskAssignmentList({
  searchQuery,
  page,
  pageSize,
  taskId,
  projectId,
  status,
  taskEndAtBefore,
  taskEndAtAfter,
  taskStartAtBefore,
  taskStartAtAfter,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  taskId?: string;
  projectId?: string;
  status?: string;
  taskStartAtBefore?: string;
  taskStartAtAfter?: string;
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
        ...(projectId && { project: projectId }),
        ...(status && { status }),
        ...(taskStartAtBefore && { task_start_at_before: taskStartAtBefore }),
        ...(taskStartAtAfter && { task_start_at_after: taskStartAtAfter }),
        ...(taskEndAtBefore && { task_end_at_before: taskEndAtBefore }),
        ...(taskEndAtAfter && { task_end_at_after: taskEndAtAfter }),
      },
      withAuth: true,
    }
  );
}

export async function getMyProjectMemberList({
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

export async function getMyProjectMemberDetail(projectId: string) {
  return apiClient.get<ProjectMemberDTO>(
    `/api/my/project_member/${projectId}`,
    {
      withAuth: true,
    }
  );
}

export async function getMyTeamMemberDetail(teamId: string) {
  return apiClient.get<TeamMemberDTO>(`/api/my/team_member/${teamId}`, {
    withAuth: true,
  });
}

export async function getTeamDetail(teamId: string) {
  return apiClient.get<TeamDetailDTO>(`/api/teams/${teamId}`, {
    withAuth: true,
  });
}

export async function getCategoryDetail(categoryId: string) {
  return apiClient.get<CategoryNameDTO>(`/api/categories/${categoryId}`, {
    withAuth: true,
  });
}

export async function getTagDetail(tagId: string) {
  return apiClient.get<TagDTO>(`/api/tags/${tagId}`, {
    withAuth: true,
  });
}

export async function getProjectDetail(projectId: string) {
  return apiClient.get<ProjectDetailDTO>(`/api/projects/${projectId}`, {
    withAuth: true,
  });
}

export async function getEventDetail(eventId: string) {
  return apiClient.get<EventDTO>(`/api/events/${eventId}`, {
    withAuth: true,
  });
}

export async function getTaskDetail(taskId: string) {
  return apiClient.get<TaskDetailDTO>(`/api/tasks/${taskId}`, {
    withAuth: true,
  });
}

export async function getTeamMemberDetail(teamMemberId: string) {
  return apiClient.get<TeamMemberDTO>(`/api/team_members/${teamMemberId}`, {
    withAuth: true,
  });
}

export async function getTeamGroupDetail(teamGroupId: string) {
  return apiClient.get<TeamGroupDTO>(`/api/team_groups/${teamGroupId}`, {
    withAuth: true,
  });
}

export async function getTeamGroupMemberDetail(teamGroupMemberId: string) {
  return apiClient.get<TeamGroupMemberDTO>(
    `/api/team_group_members/${teamGroupMemberId}`,
    {
      withAuth: true,
    }
  );
}

export async function getProjectMemberDetail(projectMemberId: string) {
  return apiClient.get<ProjectMemberDTO>(
    `/api/project_members/${projectMemberId}`,
    {
      withAuth: true,
    }
  );
}
