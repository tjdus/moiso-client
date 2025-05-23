"use client";

import { useState } from "react";
import { Box, HStack, Tabs, Text, Skeleton } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import { ProjectDetailDTO } from "@/lib/api/interface/fetchDTOs";
import ProjectMemberTable from "./ProjectMemberTable";
import TaskList from "./TaskList";
import { LuFolder, LuSquareCheck, LuUser, LuSettings, LuClock } from "react-icons/lu";
import { useParams } from "next/navigation";
import { getProjectDetail } from "@/lib/api/getApi";
import MemberSelectorWithGroup from "../custom-ui/MemberSelectorWithGroup";

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

function TabBar() {
  const { id: projectId } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("overview");

  useEffect(() => {
    const loadProjectDetail = async () => {
      try {
        const response = await getProjectDetail(projectId);
        setProject(response.data);
      } catch (error) {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetail();
  }, [projectId]);

  return (
    <Box borderBottom="1px">
      <HStack px={6} pt={4}>
        {loading ? (
          <Skeleton height="20px" width="200px" mb={4} />
        ) : project ? (
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {project.name}
          </Text>
        ) : (
          <Text fontSize="xl" fontWeight="bold" mb={4} color="red.500">
            Error loading project
          </Text>
        )}
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
          <TabTrigger value="tasks" label="Tasks" icon={<LuSquareCheck />} />
          <TabTrigger value="members" label="Members" icon={<LuUser />} />
          <TabTrigger value="settings" label="Settings" icon={<LuSettings />} />
        </Tabs.List>
        <TabContent
          value="overview"
          children={<MemberSelectorWithGroup teamId={"1"} />}
        ></TabContent>
        <TabContent
          value="tasks"
          children={<TaskList projectId={projectId} />}
        />
        <TabContent
          value="members"
          children={<ProjectMemberTable projectId={projectId} />}
        ></TabContent>
        <TabContent
          value="settings"
          children={<Text>Settings</Text>}
        ></TabContent>
      </Tabs.Root>
    </Box>
  );
}

export default TabBar;
