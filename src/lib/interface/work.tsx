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

export interface ProjectDTO {
  id: string;
  name: string;
  description: Text;
  team: TeamDTO;
  category: string;
  start_at: Date;
  end_at: Date;
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
