export interface TeamDTO {
  id: string;
  name: string;
}

export interface TeamDetailDTO {
  id: string;
  name: string;
  members: TeamMemberInfoDTO[];
  projects: ProjectDTO[];
  created_at: string;
  updated_at: string;
  created_by: MemberDTO;
  updated_by: MemberDTO;
}

export interface TeamMemberInfoDTO {
  id: string;
  member: MemberDTO;
  role: string;
  joined_at: string;
}

export interface TeamMemberDTO {
  id: string;
  team_id: string;
  member: MemberDTO;
  team: TeamDTO;
  team_groups: TeamGroupMemberInfoDTO[];
  role: string;
  joined_at: string;
}

export interface MemberDTO {
  id: string;
  name: string;
  email: string;
  username: string;
}

export interface TeamMemberDTO {
  id: string;
  team: TeamDTO;
  member: MemberDTO;
  team_groups: TeamGroupMemberInfoDTO[];
  role: string;
  joined_at: string;
}

export interface ProjectMemberInfoDTO {
  id: string;
  member: MemberDTO;
  role: string;
  joined_at: string;
}

export interface ProjectMemberDTO {
  id: string;
  project: ProjectDTO;
  member: MemberDTO;
  role: string;
  joined_at: string;
}

export interface ProjectDTO {
  id: string;
  name: string;
  description: string;
  category: CategoryNameDTO;
  start_date: string;
  end_date: string;
}

export interface ProjectDetailDTO {
  id: string;
  name: string;
  members: ProjectMemberInfoDTO[];
  category: CategoryNameDTO;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: MemberDTO;
  updated_by: MemberDTO;
}

export interface EventListDTO {
  count: number;
  next: string | null;
  previous: string | null;
  results: EventDTO[];
}

export interface EventDTO {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: MemberDTO;
  updated_by: MemberDTO | null;
  project: ProjectDetailDTO;
  members: MemberDTO[];
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  location: string;
  is_private: boolean;
}

export interface CommentDTO {
  id: string;
  member: TeamMemberDTO;
  content: string;
}

export interface TagDTO {
  id: string;
  name: string;
}

export interface TaskTagDTO {
  id: string;
  task: TaskDTO;
  tag: TagDTO;
}

export interface TaskTagInfoDTO {
  id: string;
  tag: TagDTO;
}

export interface TaskDTO {
  id: string;
  project: ProjectDTO;
  tags: TaskTagInfoDTO[];
  members: TaskAssignmentInfoDTO[];
  title: string;
  description: string;
  status: string;
  start_at: string;
  end_at: string;
}

export interface TaskAssignmentInfoDTO {
  id: string;
  member: MemberDTO;
  status: string;
  assigned_at: string;
  completed_at: string;
}

export interface TaskAssignmentDTO {
  id: string;
  member: MemberDTO;
  task: TaskDTO;
  status: string;
  assigned_at: string;
  completed_at: string;
  created_by: MemberDTO;
  updated_by: MemberDTO;
}

export interface TaskDetailDTO {
  id: string;
  project: ProjectDTO;
  members: TaskAssignmentInfoDTO[];
  tags: TaskTagInfoDTO[];
  title: string;
  description: string;
  status: string;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  created_by: MemberDTO;
  updated_by: MemberDTO;
}

export interface CategoryNameDTO {
  id: string;
  name: string;
}

export interface TeamGroupDTO {
  id: string;
  name: string;
  team: TeamDTO;
}

export interface TeamGroupNameDTO {
  id: string;
  name: string;
}

export interface TeamGroupMemberDTO {
  id: string;
  team_member: TeamMemberDTO;
  team_group: TeamGroupDTO;
}

export interface TeamGroupMemberInfoDTO {
  id: string;
  team_group: TeamGroupNameDTO;
}
