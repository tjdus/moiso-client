"use client";

import { createContext, ReactNode, useState, useContext } from "react";

interface TeamContextType {
  team: string;
  setTeam: (value: string) => void;
}

const defaultValue: TeamContextType = {
  team: "",
  setTeam: () => {},
};

export const TeamContext = createContext<TeamContextType>(defaultValue);

type Props = { children: ReactNode };

export default function TeamProvider({ children }: Props) {
  const [team, setTeam] = useState<string>("");

  const updateTeam = (newTeam: string) => {
    setTeam(newTeam);
  };

  return (
    <TeamContext.Provider value={{ team, setTeam: updateTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context as TeamContextType;
}
