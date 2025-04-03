import apiClient from "./apiClient";
import {
  TeamInput,
  ProjectInput,
  ScheduleInput,
  CategoryInput,
  TagInput,
  TaskInput,
  TaskAssignmentInput,
  TeamMemberInput,
  TeamGroupInput,
  ProjectMemberInput,
} from "./interface/requestDTO";

export async function createTeam(data: Partial<TeamInput>) {
  return apiClient.post<TeamInput, TeamInput>("/api/teams", {
    withAuth: true,
    body: data,
  });
}

export async function createProject(data: Partial<ProjectInput>) {
  return apiClient.post<ProjectInput, ProjectInput>("/api/projects", {
    withAuth: true,
    body: data,
  });
}

export async function createSchedule(data: Partial<ScheduleInput>) {
  return apiClient.post<ScheduleInput, ScheduleInput>("/api/schedule", {
    withAuth: true,
    body: data,
  });
}

export async function createCategory(data: Partial<CategoryInput>) {
  return apiClient.post<CategoryInput, CategoryInput>("/api/categories", {
    withAuth: true,
    body: data,
  });
}

export async function createTag(data: Partial<TagInput>) {
  return apiClient.post<TagInput, TagInput>("/api/tags", {
    withAuth: true,
    body: data,
  });
}

export async function createTask(data: Partial<TaskInput>) {
  return apiClient.post<TaskInput, TaskInput>("/api/tasks", {
    withAuth: true,
    body: data,
  });
}

export async function createTaskAssignment(data: Partial<TaskAssignmentInput>) {
  return apiClient.post<TaskAssignmentInput, TaskAssignmentInput>(
    "/api/task_assignments",
    {
      withAuth: true,
      body: data,
    }
  );
}

export async function createTeamMember(data: Partial<TeamMemberInput>) {
  return apiClient.post<TeamMemberInput, TeamMemberInput>("/api/team_members", {
    withAuth: true,
    body: data,
  });
}

export async function createTeamGroup(data: Partial<TeamGroupInput>) {
  return apiClient.post<TeamGroupInput, TeamGroupInput>("/api/team_groups", {
    withAuth: true,
    body: data,
  });
}

export async function createProjectMember(data: Partial<ProjectMemberInput>) {
  return apiClient.post<ProjectMemberInput, ProjectMemberInput>(
    "/api/project_members",
    {
      withAuth: true,
      body: data,
    }
  );
}
