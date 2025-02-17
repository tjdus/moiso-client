"use client";

import { fetchTaskDetail, fetchTasksByProjectId } from "@/lib/api/fetchApi";
import { useProject } from "@/lib/hooks";
import { ProjectDetailDTO, TaskDTO } from "@/lib/interface/fetchDTOs";
import { PaginationResponse } from "@/lib/interface/common";
import { useEffect, useState } from "react";
import TaskCard from "./TaksCard";
import { Stack, HStack, Flex } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

export default function TaskCardList() {
  const router = useRouter();
  const project = useProject() as ProjectDetailDTO | null;
  const projectId = project?.id || "";
  const [taskList, setTaskList] = useState<TaskDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 4;

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetchTasksByProjectId(
          projectId,
          currentPage,
          pageSize
        );
        console.log(response.data);
        setTaskList(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("업무 목록 가져오기 실패:", error);
      }
    };

    loadTasks();
  }, [projectId, currentPage]);

  const handleTaskClick = (selectedId: string) => {
    router.push(`/task/${selectedId}`);
  };

  return (
    <Flex direction="column" gap="8" justify="center">
      {taskList.length > 0 ? (
        <>
          <Stack dir="vertical" gap="4">
            {taskList.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task.id)}
              />
            ))}
          </Stack>

          <PaginationRoot
            count={totalCount}
            pageSize={pageSize}
            defaultPage={1}
            onPageChange={(e) => setCurrentPage(e.page)}
          >
            <HStack justify="center">
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </>
      ) : (
        <p>업무 목록이 없습니다.</p>
      )}
    </Flex>
  );
}
