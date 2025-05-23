"use client";

import React, { useEffect, useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";

import { Card, Tag, Text } from "@chakra-ui/react";
import { ProjectDTO } from "@/lib/api/interface/fetchDTOs";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import { useParams } from "next/navigation";
import { getProjectList } from "@/lib/api/getApi";

interface TeamCardProps {
  project: ProjectDTO;
}

const ProjectCard = ({ project }: TeamCardProps) => {
  return (
    <Card.Root
      variant="elevated"
      size="md"
      width="320px"
      height="200px"
      padding={5}
    >
      <Card.Header>
        <Card.Title>{project.name}</Card.Title>
      </Card.Header>
      <Card.Body gap={2}>
        <Card.Description>{project.description}</Card.Description>
      </Card.Body>
      <Card.Footer>
        <VStack width="100%" align="end">
          {project.category && (
            <Tag.Root size="md" paddingLeft={2} paddingRight={2}>
              <Tag.Label>{project.category.name}</Tag.Label>
            </Tag.Root>
          )}
          <Text textStyle="xs">
            {formatDateTimeKST({ dateString: project.start_date })} -{" "}
            {formatDateTimeKST({ dateString: project.end_date })}
          </Text>
        </VStack>
      </Card.Footer>
    </Card.Root>
  );
};

const ProjectCardList = () => {
  const params = useParams();
  const teamId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [projectList, setProjectList] = useState<ProjectDTO[]>([]);

  if (!teamId) {
    return;
  }

  useEffect(() => {
    const fetchProjectList = async () => {
      try {
        const response = await getProjectList({ page: 1, teamId });
        setProjectList(response.data.results);
      } catch (error) {
        console.error("Failed to fetch project list", error);
      }
    };

    fetchProjectList();
  }, [teamId]);

  return (
    <Box overflowX="auto">
      <HStack gap={4}>
        {projectList.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </HStack>
    </Box>
  );
};

export default ProjectCardList;
