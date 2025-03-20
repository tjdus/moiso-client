"use client";

import { getMyTaskAssignmentList } from "@/lib/api/getApi";
import { TaskAssignmentDTO, TaskDTO } from "@/lib/api/interface/fetchDTOs";
import {
  Collapsible,
  HStack,
  SimpleGrid,
  VStack,
  Text,
  Box,
  Separator,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TaskList from "../project/TaskList";
import MyTaskCard from "./MyTaskCard";
import { updateTaskAssignment } from "@/lib/api/patchApi";
import { LuListTodo } from "react-icons/lu";

const TodoList = () => {
  const [page, setPage] = useState(1);
  const [taskAssignmentList, setTaskAssignmentList] = useState<
    TaskAssignmentDTO[]
  >([]);

  const getTaskList = async () => {
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 10);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 3);

      const response = await getMyTaskAssignmentList({
        page,
        taskEndAtAfter: startDate.toISOString().split("T")[0],
        taskEndAtBefore: endDate.toISOString().split("T")[0],
      });
      setTaskAssignmentList(response.data.results);
    } catch (error) {
      console.error("Error fetching task assignments:", error);
    }
  };

  useEffect(() => {
    getTaskList();
  }, [page]);

  const handleCardClick = async (taskAssignmentId: string) => {
    try {
      const completedAt = new Date().toISOString();
      await updateTaskAssignment(taskAssignmentId, {
        status: "completed",
        completed_at: completedAt,
      });

      setTaskAssignmentList((prevList) =>
        prevList.filter(
          (taskAssignment) => taskAssignment.id !== taskAssignmentId
        )
      );
    } catch (error) {
      console.error("Error fetching task assignments:", error);
    }
  };

  return (
    <Box borderBottom="1px">
      <Box px={6} pt={4} mb={4}>
        <Text fontSize="sm" color="gray.500">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
        </Text>
        <HStack>
          <LuListTodo size="24px" />
          <Heading size="xl">Todo List</Heading>
        </HStack>
      </Box>
      <Separator />

      <SimpleGrid pt={6} px={6} columns={2} gap="20px">
        {taskAssignmentList.map((task) => (
          <MyTaskCard
            key={task.id}
            taskAssignment={task}
            onClick={() => handleCardClick(task.id)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default TodoList;
