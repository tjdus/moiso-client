"use client";
import React, { use, useEffect, useState } from "react";
import TabBar from "@/components/project/ProjectTabBar";
import { useRole } from "@/lib/context/RoleContext";
import { getMyProjectMemberDetail } from "@/lib/api/getApi";
import { useRouter } from "next/router";
import { Role } from "@/lib/api/interface/common";

interface Props {
  params: Promise<{ id: string }>;
}

const ProjectDetailPage = ({ params }: Props) => {
  const { setRole } = useRole();
  const { id } = use(params);

  useEffect(() => {
    const getRole = async () => {
      const response = await getMyProjectMemberDetail(id);
      const data = response.data;
      setRole(data.role as Role);
    };
    getRole();
  }, [id, setRole]);

  return <TabBar />;
};

export default ProjectDetailPage;
