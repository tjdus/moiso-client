"use client";

import { useState } from "react";
import { Box, HStack, Tabs, Text, Skeleton } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import { ProjectDetailDTO, ProjectDTO } from "@/lib/interface/fetchDTOs";
import ProjectMemberTable from "../Table/ProjectMemberTable";
import TaskList from "../Table/TaskList";
import { LuFolder, LuSquareCheck, LuUser, LuSettings } from "react-icons/lu";
import TaskCreationDialog from "../dialog/create/TaskCreationDialog";
import { useParams } from "next/navigation";
import { fetchProjectDetail } from "@/lib/api/fetchApi";

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
  const params = useParams();
  const [project, setProject] = useState<ProjectDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [tab, setTab] = useState<string>("overview");

  if (!projectId) {
    return <Text>Select Project</Text>;
  }

  useEffect(() => {
    const loadProjectDetail = async () => {
      try {
        const response = await fetchProjectDetail(projectId);
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
        <TaskCreationDialog />
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
          children={<Text>Overview</Text>}
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
