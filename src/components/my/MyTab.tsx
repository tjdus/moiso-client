"use client";

import { useState } from "react";
import { Box, HStack, Tabs, Text, Skeleton } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import {
  ProjectDetailDTO,
  ProjectDTO,
  TeamDetailDTO,
} from "@/lib/api/interface/fetchDTOs";
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
import MyProjectTable from "./MyProjectTable";
import MyTaskTable from "./MyTaskTable";

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

function MyTabBar() {
  const [tab, setTab] = useState<string>("overview");

  return (
    <Box borderBottom="1px">
      <HStack px={6} pt={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          데이터베이스
        </Text>
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
          <TabTrigger value="tasks" label="Task" icon={<LuUser />} />
          <TabTrigger
            value="projects"
            label="Projects"
            icon={<LuSquareCheck />}
          />

          <TabTrigger value="settings" label="Settings" icon={<LuSettings />} />
        </Tabs.List>
        <TabContent value="overview">
          <ProjectCardList />
        </TabContent>
        <TabContent value="tasks">
          <MyTaskTable />
        </TabContent>
        <TabContent value="projects">
          <MyProjectTable />
        </TabContent>

        <TabContent
          value="settings"
          children={<Text>Settings</Text>}
        ></TabContent>
      </Tabs.Root>
    </Box>
  );
}

export default MyTabBar;
