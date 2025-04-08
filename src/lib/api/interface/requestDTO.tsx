import { Status } from "./common";

export interface ProjectInput {
  id?: string;
  team?: string;
  name?: string;
  description?: string;
  members?: string[];
  category?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface EventInput {
  id?: string;
  project?: string;
  members?: string[];
  title?: string;
  description?: string;
  start_at?: string;
  end_at?: string;
  location?: string;
  is_private?: boolean;
}

export interface TeamInput {
  id?: string;
  name?: string;
  members?: string[];
}

export interface CategoryInput {
  id?: string;
  name?: string;
  team?: string;
}

export interface TagInput {
  id?: string;
  name?: string;
  project?: string;
}

export interface TaskInput {
  id?: string;
  project?: string;
  tags?: string[];
  members?: string[];
  title?: string;
  description?: string;
  status?: string;
  start_at?: string;
  end_at?: string;
}

export interface TaskAssignmentInput {
  id?: string;
  task?: string;
  member?: string;
  status?: string;
  assigned_at?: string;
  completed_at?: string;
}

export interface TeamMemberInput {
  id?: string;
  team?: string;
  member?: string;
  team_groups?: string[];
}

export interface ProjectMemberInput {
  id?: string;
  project?: string;
  member?: string;
  role?: string;
}

export interface TeamGroupInput {
  id?: string;
  team?: string;
  name?: string;
}
