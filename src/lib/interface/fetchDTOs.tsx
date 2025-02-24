export interface TeamDTO {
  id: string;
  name: string;
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
  role: string;
  joined_at: string;
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
  project: string;
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
  category: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
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

export interface TagDTO {
  id: string;
  name: string;
}

export interface TaskDTO {
  id: string;
  tags: TagDTO[];
  members: MemberDTO[];
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
  task: string;
  status: string;
  assigned_at: string;
  completed_at: string;
  created_by: MemberDTO;
  updated_by: MemberDTO;
}

export interface TaskDetailDTO {
  id: string;
  project: string;
  assigned_members: TaskAssignmentInfoDTO[];
  tags: TagDTO[];
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

export interface RoleGroupDTO {
  id: string;
  name: string;
  team: string;
}

export interface RoleGroupNameDTO {
  id: string;
  name: string;
}

export interface RoleGroupMemberDTO {
  id: string;
  role_group: RoleGroupDTO;
  member: MemberDTO;
  is_leader: boolean;
}

export interface TeamMemberDetailDTO {
  member: TeamMemberInfoDTO;
  projects: ProjectDTO[];
  role_groups: RoleGroupDTO[];
}
