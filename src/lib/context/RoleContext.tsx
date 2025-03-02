"use client";

import { createContext, ReactNode, useState, useContext } from "react";
import { Role } from "../api/interface/common";

interface RoleContextType {
  role: Role | null;
  setRole: (value: Role | null) => void;
}

const defaultValue: RoleContextType = {
  role: null,
  setRole: () => {},
};

export const RoleContext = createContext<RoleContextType>(defaultValue);

type Props = { children: ReactNode };

export default function RoleProvider({ children }: Props) {
  const [role, setRole] = useState<Role | null>(null);

  const updateRole = (newRole: Role | null) => {
    setRole(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole: updateRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context as RoleContextType;
}
