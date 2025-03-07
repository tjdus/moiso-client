import apiClient from "./apiClient";
import {
  CategoryInput,
  ProjectInput,
  TagInput,
  TaskAssignmentInput,
  TaskInput,
  TeamGroupInput,
  TeamInput,
  TeamMemberInput,
} from "./interface/requestDTO";

export async function updateTeam(id: string, updatedData: Partial<TeamInput>) {
  return apiClient.patch<Partial<TeamInput>, TeamInput>(`/api/teams/${id}`, {
    withAuth: true,
    body: updatedData,
  });
}

export async function updateProject(
  id: string,
  updatedData: Partial<ProjectInput>
) {
  return apiClient.patch<Partial<ProjectInput>, ProjectInput>(
    `/api/projects/${id}`,
    {
      withAuth: true,
      body: updatedData,
    }
  );
}

export async function updateTask(id: string, updatedData: Partial<TaskInput>) {
  return apiClient.patch<Partial<TaskInput>, TaskInput>(`/api/tasks/${id}`, {
    withAuth: true,
    body: updatedData,
  });
}

export async function updateTag(id: string, updatedData: Partial<TagInput>) {
  return apiClient.patch<Partial<TagInput>, TagInput>(`/api/tags/${id}`, {
    withAuth: true,
    body: updatedData,
  });
}

export async function updateCategory(
  id: string,
  updatedData: Partial<CategoryInput>
) {
  return apiClient.patch<Partial<CategoryInput>, CategoryInput>(
    `/api/categories/${id}`,
    {
      withAuth: true,
      body: updatedData,
    }
  );
}

export async function updateTeamMember(
  id: string,
  updatedData: Partial<TeamMemberInput>
) {
  return apiClient.patch<TeamMemberInput, TeamMemberInput>(
    `/api/team_members/${id}`,
    {
      withAuth: true,
      body: updatedData,
    }
  );
}

export async function updateTeamGroup(
  id: string,
  updatedData: Partial<TeamGroupInput>
) {
  return apiClient.patch<Partial<TeamGroupInput>, TeamGroupInput>(
    `/api/team_groups/${id}`,
    {
      withAuth: true,
      body: updatedData,
    }
  );
}

export async function updateTaskAssignment(
  id: string,
  data: Partial<TaskAssignmentInput>
) {
  return apiClient.patch<TaskAssignmentInput, TaskAssignmentInput>(
    `/api/task_assignments/${id}`,
    {
      withAuth: true,
      body: data,
    }
  );
}
