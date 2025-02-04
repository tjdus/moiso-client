"use client";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";

interface ProjectDTO {
  name: string;
}

function ProjectItem({ project }: { project: ProjectDTO }) {
  return (
    <Flex
      align="center"
      p={3}
      borderRadius="md"
      bg="white"
      _hover={{ bg: "gray.100" }}
      gap={3}
    >
      <Box>
        <Text fontSize="xs" fontWeight="bold">{project.name}</Text>
      </Box>
    </Flex>
  );
}

const projects = [
  { name: "Web Application" },
  { name: "Django Study"}
];

export default function ProjectList() {
  return (
    <Stack gap={3} p={4}>
      {projects.map((project) => (
        <ProjectItem key={project.name} project={project} />
      ))}
    </Stack>
  );
}

