"use client";

import { EventCalendar } from "@/components/calendar/DayzedDatepicker";
import {
  getMyProjectMemberList,
  getMyTaskAssignmentList,
} from "@/lib/api/getApi";
import {
  ProjectDTO,
  ProjectMemberDTO,
  TaskAssignmentDTO,
} from "@/lib/api/interface/fetchDTOs";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import TaskDetailDialog, {
  useTaskDetailDialog,
} from "../dialog/TaskDetail/TaskDetailDialog";
import { set } from "lodash";
import { CalendarTabs } from "./CalendarTabs";

interface SideBardProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CalendarSideBar = ({ value, onValueChange }: SideBardProps) => {
  const [projectList, setProjectList] = useState<ProjectMemberDTO[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getMyProjectMemberList({});
        setProjectList(response.data.results);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

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
        <Stack padding={4} gap={4}>
          {projectList.map((projectMember) => (
            <Checkbox.Root
              key={projectMember.id}
              checked={value === projectMember.project.id}
              onCheckedChange={(e) => {
                if (e.checked) {
                  onValueChange(projectMember.project.id);
                } else {
                  onValueChange("");
                }
              }}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>{projectMember.project.name}</Checkbox.Label>
            </Checkbox.Root>
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

interface EventCalendarProps {
  onClickMoreButton: (id: string) => void;
}

export default function ExampleComponent() {
  const [taskAssignmentList, setTaskAssignmentList] = useState<
    TaskAssignmentDTO[]
  >([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projectId, setProjectId] = useState<string>("");
  const { setTaskId, setOpen } = useTaskDetailDialog();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickMoreButton = (id: string): void => {
    setTaskId(id);
    setOpen(true);
  };

  const getTasks = async () => {
    try {
      const response = await getMyTaskAssignmentList(
        projectId ? { projectId } : {}
      );
      setTaskAssignmentList(response.data.results);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, [projectId]);

  return (
    <Flex>
      <TaskDetailDialog />
      {/* Toggle Button */}
      <Button
        position="fixed"
        top="200"
        right={isSidebarOpen ? "260px" : "4"}
        zIndex={200}
        size="sm"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        transition="right 0.3s"
      >
        <Icon as={FiMenu} />
      </Button>

      {/* Sidebar with animation */}
      <Box
        position="fixed"
        right={isSidebarOpen ? "0" : "-250px"}
        top="0"
        height="100vh"
        transition="right 0.3s ease"
      >
        <CalendarSideBar value={projectId} onValueChange={setProjectId} />
      </Box>

      {/* Main content */}
      <Box
        mr={isSidebarOpen ? "250px" : "0"}
        transition="margin 0.3s ease"
        width="100%"
      >
        <CalendarTabs
          events={taskAssignmentList}
          onClickMoreButton={handleClickMoreButton}
        />
      </Box>
    </Flex>
  );
}
