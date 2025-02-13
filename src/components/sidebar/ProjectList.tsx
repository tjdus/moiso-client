"use client";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { ProjectDTO, TeamDetailDTO } from "@/lib/interface/work";
import { TeamSpaceContext } from "@/lib/context/TeamContext";
import { FaFolderOpen } from "react-icons/fa";
import { useTeam } from "@/lib/hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setProject } from "@/lib/slice/projectSlice";
import { fetchProjectDetail } from "@/lib/api/api";

function ProjectItem({ project }: { project: ProjectDTO }) {
  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      const response = await fetchProjectDetail(project.id);
      dispatch(setProject(response.data));
    } catch (error) {
      console.error("팀 정보 조회 실패:", error);
    }
  };
  return (
    <Flex
      align="center"
      p={3}
      borderRadius="md"
      bg="white"
      _hover={{ bg: "gray.100" }}
      gap={3}
      onClick={handleClick}
    >
      <Box>
        <Text fontSize="xs" fontWeight="bold">
          {project.name}
        </Text>
      </Box>
    </Flex>
  );
}

export default function ProjectList() {
  //const { teamSpace, setTeamSpace } = useContext(TeamSpaceContext);
  //const projectList = teamSpace?.projects || [];
  const dispatch = useDispatch();
  const team = useTeam() as TeamDetailDTO | null;
  const projectList = team?.projects || [];
  //const selectedProject = useSelector((state: RootState) => state.project);

  return (
    <Stack gap={3} p={4}>
      {projectList.length > 0 ? (
        projectList.map((project) => (
          <ProjectItem key={project.name} project={project} />
        ))
      ) : (
        <Stack align="center" gap={2}>
          <FaFolderOpen size={50} color="gray.400" />
          <Text textAlign="center" color="gray.500">
            등록된 프로젝트가 없습니다.
          </Text>
        </Stack>
      )}
    </Stack>
  );
}
