"use client";
import React, { useEffect, useState } from "react";
import TabBar from "@/components/navbar/ProjectTabBar";
import { useRole } from "@/lib/context/RoleContext";
import { fetchMyProjectMemberDetail } from "@/lib/api/fetchApi";
import { useRouter } from "next/router";
import { Role } from "@/lib/api/interface/common";
import { useProject } from "@/lib/context/ProjectContext";

interface Props {
  params: Promise<{ id: string }>;
}

const ProjectDetailPage = ({ params }: Props) => {
  const { role, setRole } = useRole();
  const { setProject } = useProject();
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
        const response = await fetchMyProjectMemberDetail(id);
        const data = response.data;
        setRole(data.role as Role);
      };
      getRole();
      setProject(id);
    }
  }, [id, setRole, role]);

  return id ? <TabBar /> : null;
};

export default ProjectDetailPage;
