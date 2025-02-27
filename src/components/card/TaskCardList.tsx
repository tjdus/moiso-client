"use client";

import { useProject } from "@/lib/hooks";
import { ProjectDetailDTO, TaskDTO } from "@/lib/api/interface/fetchDTOs";
import { PaginationResponse } from "@/lib/api/interface/common";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { Stack, HStack, Flex } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { fetchTaskList } from "@/lib/api/fetchApi";

export default function TaskCardList() {
  const router = useRouter();
  const project = useProject() as ProjectDetailDTO | null;
  const projectId = project?.id || "";
  const [taskList, setTaskList] = useState<TaskDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 4;

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetchTaskList({
          projectId,
          page,
          pageSize,
        });
        console.log(response.data);
        setTaskList(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("업무 목록 가져오기 실패:", error);
      }
    };

    loadTasks();
  }, [projectId, page]);

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
            onPageChange={(e) => setPage(e.page)}
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
