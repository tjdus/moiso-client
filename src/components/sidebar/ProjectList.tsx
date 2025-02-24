"use client";
import { Box, Flex, Text, Stack, EmptyState } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { ProjectDTO, TeamDetailDTO } from "@/lib/interface/fetchDTOs";
import { TeamSpaceContext, useTeamSpace } from "@/lib/context/TeamContext";
import { FaFolderOpen } from "react-icons/fa";
import { useTeam } from "@/lib/hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setProject } from "@/lib/slice/projectSlice";
import { fetchProjectDetail } from "@/lib/api/fetchApi";
import { useRouter } from "next/navigation";
import { LuCircleAlert, LuFolder } from "react-icons/lu";

function ProjectItem({ project }: { project: ProjectDTO }) {
  const router = useRouter();

  const handleClick = async () => {
    try {
      router.push(`/workspace/project/${project.id}`);
    } catch (error) {
      console.error("라우팅 실패:", error);
    }
  };
  return (
    <Box
      p={3}
      borderRadius="md"
      _hover={{ bg: "gray.100" }}
      gap={3}
      onClick={handleClick}
    >
      <Text fontSize="xs" fontWeight="medium">
        {project.name}
      </Text>
    </Box>
  );
}

export default function ProjectList() {
  const { teamSpace, setTeamSpace } = useTeamSpace();
  const projectList = teamSpace?.projects || [];

  if (!teamSpace) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuCircleAlert />
          </EmptyState.Indicator>
          <EmptyState.Description>팀을 선택하세요</EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  if (!projectList.length) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuFolder />
          </EmptyState.Indicator>
          <EmptyState.Description>
            아직 프로젝트가 없어요
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  return (
    <Stack gap={3} p={4}>
      {projectList.map((project) => (
        <ProjectItem key={project.name} project={project} />
      ))}
    </Stack>
  );
}
