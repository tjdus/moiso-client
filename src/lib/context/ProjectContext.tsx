"use client";

import { createContext, ReactNode, useState, useContext } from "react";

interface ProjectContextType {
  project: string;
  setProject: (value: string) => void;
}

const defaultValue: ProjectContextType = {
  project: "",
  setProject: () => {},
};

export const ProjectContext = createContext<ProjectContextType>(defaultValue);

type Props = { children: ReactNode };

export default function ProjectProvider({ children }: Props) {
  const [project, setProject] = useState<string>("");

  const updateProject = (newProject: string) => {
    setProject(newProject);
  };

  return (
    <ProjectContext.Provider
      value={{ project: project, setProject: updateProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context as ProjectContextType;
}
