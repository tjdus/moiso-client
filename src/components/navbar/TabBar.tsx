"use client";

import { Box, Tabs, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useProject, useTab } from "@/lib/hooks";
import { setTab } from "@/lib/slice/tabSlice";
import { useDispatch, useSelector } from "react-redux";
import { ProjectDTO } from "@/lib/interface/fetchDTOs";
import ProjectMemberTable from "../Table/ProjectMemberTable";
import TaskList from "../Table/TaskList";
import { LuFolder, LuSquareCheck, LuUser, LuSettings } from "react-icons/lu";
import TaskCreationDialog from "../dialog/TaskCreationDialog";

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
  const project = useProject() as ProjectDTO | null;
  const tab = useTab() || "overview";
  const dispatch = useDispatch();

  const handleTabChange = (details: { value: string }) => {
    dispatch(setTab(details.value));
  };

  if (!project) {
    return <Text>Select Project</Text>;
  }

  return (
    <Box borderBottom="1px">
      <Box px={6} pt={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {project.name}
        </Text>
        <TaskCreationDialog />
      </Box>
      <Tabs.Root
        value={tab}
        onValueChange={handleTabChange}
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
        <TabContent value="tasks" children={<TaskList />}></TabContent>
        <TabContent
          value="members"
          children={<ProjectMemberTable />}
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
