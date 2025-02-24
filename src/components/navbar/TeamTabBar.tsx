"use client";

import { useState } from "react";
import { Box, HStack, Tabs, Text, Skeleton } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import {
  ProjectDetailDTO,
  ProjectDTO,
  TeamDetailDTO,
} from "@/lib/interface/fetchDTOs";
import ProjectMemberTable from "../Table/ProjectMemberTable";
import TaskList from "../Table/TaskList";
import { LuFolder, LuSquareCheck, LuUser, LuSettings } from "react-icons/lu";
import TaskCreationDialog from "../dialog/create/TaskCreationDialog";
import { useParams } from "next/navigation";
import { fetchProjectDetail, fetchTeamDetail } from "@/lib/api/fetchApi";
import ProjectCardList from "../card/ProjectCardList";
import { set } from "lodash";
import ProjectTable from "../Table/ProjectTable";
import TeamMemberTable from "../Table/TeamMemberTable";
import RoleCreationDialog from "../dialog/create/RoleCreationDialog";

interface TabContentProps {
  value: string;
  children: ReactNode;
}

function TabContent({ value, children }: TabContentProps) {
  return (
    <Box pos="relative" py={2} height="100%">
      <Tabs.Content
        value={value}
        position="relative"
        _open={{
          animationName: "fade-in, scale-in",
          animationDuration: "300ms",
        }}
        _closed={{
          animationName: "fade-out, scale-out",
          animationDuration: "120ms",
        }}
        height="100%"
      >
        {children}
      </Tabs.Content>
    </Box>
  );
}

interface TabTriggerProps {
  icon: ReactNode;
  value: string;
  label: string;
}

function TabTrigger({ icon, value, label }: TabTriggerProps) {
  return (
    <Tabs.Trigger
      value={value}
      gap={2}
      fontSize="sm"
      fontWeight="semibold"
      _selected={{
        color: "blue.500",
        borderColor: "blue.500",
        fontWeight: "bold",
      }}
    >
      {icon}
      {label}
    </Tabs.Trigger>
  );
}

function TeamTabBar() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const teamId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [team, setTeam] = useState<TeamDetailDTO | null>(null);
  const [tab, setTab] = useState<string>("overview");

  if (!teamId) {
    return;
  }

  useEffect(() => {
    const loadTeamDetail = async () => {
      try {
        const response = await fetchTeamDetail(teamId);
        setTeam(response.data);
      } catch (error) {
        setTeam(null);
      } finally {
        setLoading(false);
      }
    };

    loadTeamDetail();
  }, [teamId]);

  return (
    <Box borderBottom="1px">
      <HStack px={6} pt={4}>
        {loading ? (
          <Skeleton height="20px" width="200px" mb={4} />
        ) : team ? (
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {team.name}
          </Text>
        ) : (
          <Text fontSize="xl" fontWeight="bold" mb={4} color="red.500">
            Error loading team
          </Text>
        )}
        <RoleCreationDialog />
      </HStack>
      <Tabs.Root
        value={tab}
        onValueChange={(e) => setTab(e.value)}
        px={6}
        variant="line"
        colorPalette="blue"
        lazyMount
        unmountOnExit
      >
        <Tabs.List gap={4}>
          <TabTrigger value="overview" label="Overview" icon={<LuFolder />} />
          <TabTrigger
            value="projects"
            label="Projects"
            icon={<LuSquareCheck />}
          />
          <TabTrigger value="members" label="Members" icon={<LuUser />} />
          <TabTrigger value="settings" label="Settings" icon={<LuSettings />} />
        </Tabs.List>
        <TabContent value="overview">
          <ProjectCardList />
        </TabContent>
        <TabContent value="projects">
          <ProjectTable teamId={teamId} />
        </TabContent>
        <TabContent value="members">
          <TeamMemberTable teamId={teamId} />
        </TabContent>
        <TabContent
          value="settings"
          children={<Text>Settings</Text>}
        ></TabContent>
      </Tabs.Root>
    </Box>
  );
}

export default TeamTabBar;
