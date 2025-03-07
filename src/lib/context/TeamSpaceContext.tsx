"use client";
import { createContext, ReactNode, useState, useContext } from "react";
import { TeamDetailDTO } from "../api/interface/fetchDTOs";

interface TeamSpaceContextType {
  teamSpace: TeamDetailDTO | null;
  setTeamSpace: (value: TeamDetailDTO | null) => void;
}

const defaultValue: TeamSpaceContextType = {
  teamSpace: null,
  setTeamSpace: () => {},
};

export const TeamSpaceContext =
  createContext<TeamSpaceContextType>(defaultValue);

type Props = { children: ReactNode };

export default function TeamSpaceProvider({ children }: Props) {
  const [teamSpace, setTeamSpace] = useState<TeamDetailDTO | null>(null);

  return (
    <TeamSpaceContext.Provider value={{ teamSpace, setTeamSpace }}>
      {children}
    </TeamSpaceContext.Provider>
  );
}

export function useTeamSpace() {
  const context = useContext(TeamSpaceContext);
  if (!context) {
    throw new Error("useTeamSpace must be used within a TeamProvider");
  }
  return context;
}
