import apiClient from "./apiClient";
import {
  TeamForm,
  ProjectForm,
  CategoryForm,
  TagForm,
  TaskForm,
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
