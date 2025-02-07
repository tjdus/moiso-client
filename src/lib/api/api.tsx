import apiClient from "./apiClient";
import { TeamDTO, TeamDetailDTO, ProjectDTO } from "../interface/work";

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
