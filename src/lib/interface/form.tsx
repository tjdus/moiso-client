import { Status } from "./common";

export interface ProjectForm {
  id?: string;
  team?: string;
  name?: string;
  description?: string;
  members?: string[];
  category?: string;
  status?: Status;
  start_date?: string;
  end_date?: string;
}

export interface TeamForm {
  id?: string;
  name?: string;
  members?: string[];
}

export interface CategoryForm {
  id?: string;
  name?: string;
  team?: string;
}

export interface TagForm {
  id?: string;
  name?: string;
  project?: string;
}

export interface TaskForm {
  id?: string;
  tags?: string[];
  members?: string[];
  title?: string;
  description?: string;
  status?: string;
  start_at?: string;
  end_at?: string;
}
