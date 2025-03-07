"use client";

import TeamTabBar from "@/components/navbar/TeamTabBar";
import { fetchMyTeamMemberDetail } from "@/lib/api/fetchApi";
import { Role } from "@/lib/api/interface/common";
import { useRole } from "@/lib/context/RoleContext";
import { useTeam } from "@/lib/context/TeamProvider";
import { useEffect, useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

const TeamDetailPage = ({ params }: Props) => {
  const { role, setRole } = useRole();
  const { setTeam } = useTeam();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setId(unwrappedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      const getRole = async () => {
        const response = await fetchMyTeamMemberDetail(id);
        const data = response.data;
        setRole(data.role as Role);
      };
      getRole();
      setTeam(id);
    }
  }, [id, setRole, role]);
  return id ? <TeamTabBar /> : null;
};

export default TeamDetailPage;
