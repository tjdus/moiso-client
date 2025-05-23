"use client";

import { useState } from "react";
import { Box, HStack, Tabs, Text, Skeleton } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import { TeamDetailDTO } from "@/lib/api/interface/fetchDTOs";
import { LuFolder, LuSquareCheck, LuUser, LuSettings, LuClock } from "react-icons/lu";
import { useParams } from "next/navigation";
import { getTeamDetail } from "@/lib/api/getApi";
import ProjectCardList from "../card/ProjectCardList";
import ProjectTable from "./ProjectTable";
import TeamMemberTable from "./TeamMemberTable";
import RoleCreationDialog from "../dialog/create/RoleCreationDialog";
import EventTable from "./EventTable";

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
  const { id: teamId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  const [team, setTeam] = useState<TeamDetailDTO | null>(null);
  const [tab, setTab] = useState<string>("overview");

  useEffect(() => {
    const loadTeamDetail = async () => {
      try {
        const response = await getTeamDetail(teamId);
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
          <TabTrigger value="events" label="Events" icon={<LuClock />} />
          <TabTrigger value="members" label="Members" icon={<LuUser />} />
          <TabTrigger value="settings" label="Settings" icon={<LuSettings />} />
        </Tabs.List>
        <TabContent value="overview">
          <ProjectCardList />
        </TabContent>
        <TabContent value="projects">
          <ProjectTable teamId={teamId} />
        </TabContent>
        <TabContent
          value="events"
          children={<EventTable teamId={teamId} />}
        />
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
