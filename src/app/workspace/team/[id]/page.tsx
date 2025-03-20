"use client";

import TeamTabBar from "@/components/team/TeamTabBar";
import { getMyTeamMemberDetail } from "@/lib/api/getApi";
import { Role } from "@/lib/api/interface/common";
import { useRole } from "@/lib/cont\ext/RoleContext";
import { use, useEffect, useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

const TeamDetailPage = ({ params }: Props) => {
  const { setRole } = useRole();
  const { id } = use(params);

  useEffect(() => {
    const getRole = async () => {
      const response = await getMyTeamMemberDetail(id);
      const data = response.data;
      setRole(data.role as Role);
    };
    getRole();
  }, [id, setRole]);
  return <TeamTabBar />;
};

export default TeamDetailPage;
