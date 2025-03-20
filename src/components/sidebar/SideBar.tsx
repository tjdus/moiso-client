"use client";

import React from "react";
import {
  Stack,
  StackSeparator,
  Card,
  Link,
  Box,
  Text,
  EmptyState,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  HStack,
  Button,
} from "@chakra-ui/react";

import TeamSelectOption from "./TeamSelectOption";
import { useTeamSpace } from "@/lib/context/TeamSpaceContext";
import { ProjectDTO } from "@/lib/api/interface/fetchDTOs";
import { useRouter } from "next/navigation";
import { LuCircleAlert, LuFolder, LuSettings } from "react-icons/lu";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

function ProjectItem({ project }: { project: ProjectDTO }) {
  return (
    <Box p={3} borderRadius="md" _hover={{ bg: "gray.100" }} gap={3}>
      <NextLink href={`/workspace/project/${project.id}`}>
        <HStack>
          <LuFolder />
          <Text fontSize="sm">{project.name}</Text>
        </HStack>
      </NextLink>
    </Box>
  );
}

function ProjectList() {
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

function MenuAccordion() {
  return (
    <AccordionRoot collapsible defaultValue={["members"]}>
      {/* <AccordionItem value="members">
        <AccordionItemTrigger fontSize="md" fontWeight="bold" p={3}>
          Team Members
        </AccordionItemTrigger>
        <AccordionItemContent p={4} fontSize="md">
          <MemberList />
        </AccordionItemContent>
      </AccordionItem> */}
      <AccordionItem value="projects">
        <AccordionItemTrigger fontSize="sm" p={3}>
          <LuFolder />
          프로젝트
        </AccordionItemTrigger>
        <AccordionItemContent p={4} fontSize="md">
          <ProjectList />
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

export default function SideBar() {
  const { teamSpace, setTeamSpace } = useTeamSpace();
  const router = useRouter();

  const handleTeamSettingsClick = () => {
    router.push(`/workspace/team/${teamSpace?.id}`);
  };

  return (
    <Card.Root
      w="250px"
      p="4"
      borderRadius="md"
      boxShadow="lg"
      minH="100vh"
      zIndex={100}
    >
      <Card.Body>
        <Stack gap="2">
          <TeamSelectOption />
          <MenuAccordion />
          {teamSpace && (
            <Button onClick={handleTeamSettingsClick}>
              <HStack>
                <LuSettings />
                <Text fontSize="sm">팀 설정</Text>
              </HStack>
            </Button>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
