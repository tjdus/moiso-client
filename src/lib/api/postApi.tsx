import apiClient from "./apiClient";
import {
  TeamForm,
  ProjectForm,
  CategoryForm,
  TagForm,
  TaskForm,
  TaskAssignmentForm,
  RoleGroupForm,
} from "../interface/form";

export async function createTeam({ name }: TeamForm) {
  return apiClient.post<TeamForm, TeamForm>("/api/teams/", {
    withAuth: true,
    body: { name },
  });
}

export async function createProject({
  team,
  name,
  description,
  members,
  category,
  status,
  start_date: start_at,
  end_date: end_at,
}: ProjectForm) {
  return apiClient.post<ProjectForm, ProjectForm>("/api/projects/", {
    withAuth: true,
    body: {
      team,
      name,
      description,
      members,
      category,
      status,
      start_date: start_at,
      end_date: end_at,
    },
  });
}

export async function createCategory({ team, name }: CategoryForm) {
  return apiClient.post<CategoryForm, CategoryForm>("/api/categories/", {
    withAuth: true,
    body: { team, name },
  });
}

export async function createTag({ project, name }: TagForm) {
  return apiClient.post<TagForm, TagForm>("/api/tags/", {
    withAuth: true,
    body: { project, name },
  });
}

export async function createTask({
  project,
  tags,
  members,
  title,
  description,
  status,
  start_at,
  end_at,
}: TaskForm) {
  return apiClient.post<TaskForm, TaskForm>("/api/tasks/", {
    withAuth: true,
    body: {
      project,
      tags,
      members,
      title,
      description,
      status,
      start_at: start_at,
      end_at: end_at,
    },
  });
}

export async function createTaskAssignment({
  task,
  member,
  status,
}: TaskAssignmentForm) {
  return apiClient.post<TaskAssignmentForm, TaskAssignmentForm>(
    "/api/task_assignments/",
    {
      withAuth: true,
      body: {
        task,
        member,
        status,
      },
    }
  );
}

export async function createRoleGroup({ team, name }: RoleGroupForm) {
  return apiClient.post<RoleGroupForm, RoleGroupForm>("/api/role_groups/", {
    withAuth: true,
    body: {
      team,
      name,
    },
  });
}
