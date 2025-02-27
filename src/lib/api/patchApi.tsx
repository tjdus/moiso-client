import apiClient from "./apiClient";
import { TaskAssignmentForm, TaskForm, TeamMemberForm } from "./interface/form";

export async function updateTask({
  id,
  project,
  tags,
  members,
  title,
  description,
  status,
  start_at,
  end_at,
}: Partial<TaskForm>) {
  return apiClient.patch<Partial<TaskForm>, TaskForm>(`/api/tasks/${id}`, {
    withAuth: true,
    body: {
      ...(project !== undefined && { project }),
      ...(tags !== undefined && { tags }),
      ...(members !== undefined && { members }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(start_at !== undefined && { start_at }),
      ...(end_at !== undefined && { end_at }),
    },
  });
}

export async function updateTeamMember({
  teamMemberId,
  teamGroups,
  teamId,
  memberId,
}: {
  teamMemberId: string;
  teamGroups?: string[];
  teamId?: string;
  memberId?: string;
}) {
  return apiClient.patch<TeamMemberForm, TeamMemberForm>(
    `/api/team_members/${teamMemberId}`,
    {
      withAuth: true,
      body: {
        ...(teamGroups && { team_groups: teamGroups }),
        ...(teamId && { team_id: teamId }),
        ...(memberId && { member_id: memberId }),
      },
    }
  );
}

export async function updateTaskAssignment(
  taskAssigmentId: string,
  { status, completed_at }: TaskAssignmentForm
) {
  return apiClient.patch<TaskAssignmentForm, TaskAssignmentForm>(
    `/api/task_assignments/${taskAssigmentId}`,
    {
      withAuth: true,
      body: {
        ...(status !== undefined && { status }),
        ...(completed_at !== undefined && { completed_at }),
      },
    }
  );
}
