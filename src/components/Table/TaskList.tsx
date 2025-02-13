"use client";

import { useContext, useEffect, useState } from "react";
import { useProject } from "@/lib/hooks";
import { fetchTasksByProjectId } from "@/lib/api/api";
import { TaskDTO, ProjectDetailDTO } from "@/lib/interface/work";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableColumnHeader,
  TableRow,
  TableCell,
  Flex,
  HStack,
  Tag,
  AvatarGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { TagItem, StatusTag } from "@/components/custom-ui/Tag";
import { AvatarList } from "@/components/custom-ui/Avatar";
const headers = [
  "제목",
  "설명",
  "태그",
  "상태",
  "담당자들",
  "시작일",
  "마감일",
];

export default function TaskList() {
  const router = useRouter();
  const project = useProject() as ProjectDetailDTO | null;
  const projectId = project?.id || "";
  const [taskList, setTaskList] = useState<TaskDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTasksByProjectId(
          projectId,
          currentPage,
          pageSize
        );
        setTaskList(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("업무 목록 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [projectId, currentPage]);

  const handleTaskClick = (selectedId: string) => {
    router.push(`/task/${selectedId}`);
  };

  if (!project) {
    return <p>프로젝트 데이터를 불러올 수 없습니다.</p>;
  }

  return (
    <Flex
      direction="column"
      gap="8"
      position="sticky"
      top="0"
      zIndex="2"
      height="100vh"
      overflow="auto"
    >
      <TableRoot
        size="lg"
        backgroundColor="white"
        borderRadius="md"
        border="1px"
        borderColor="gray.700"
      >
        <TableHeader fontSize="sm" textAlign="center">
          <TableRow>
            {headers.map((header, index) => (
              <TableColumnHeader
                key={index}
                padding={4}
                backgroundColor="white"
                borderBottom="2px"
                borderColor="gray.700"
                color="text.default"
                textAlign="center"
              >
                {header}
              </TableColumnHeader>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow
                  key={index}
                  borderBottom="1px"
                  borderColor="gray.700"
                  backgroundColor="white"
                >
                  <TableCell padding={4}>
                    <Skeleton height="20px" width="180px" />
                  </TableCell>
                  <TableCell padding={4}>
                    <SkeletonText noOfLines={2} gap="2" width="200px" />
                  </TableCell>
                  <TableCell padding={4}>
                    <Flex gap={2}>
                      <Skeleton
                        height="20px"
                        width="60px"
                        borderRadius="full"
                      />
                      <Skeleton
                        height="20px"
                        width="70px"
                        borderRadius="full"
                      />
                    </Flex>
                  </TableCell>
                  <TableCell padding={4}>
                    <Skeleton height="24px" width="80px" borderRadius="md" />
                  </TableCell>
                  <TableCell padding={4}>
                    <Flex>
                      <Skeleton
                        height="32px"
                        width="32px"
                        borderRadius="full"
                      />
                      <Skeleton
                        height="32px"
                        width="32px"
                        borderRadius="full"
                        ml="-2"
                      />
                    </Flex>
                  </TableCell>
                  <TableCell padding={4}>
                    <Skeleton height="20px" width="80px" />
                  </TableCell>
                  <TableCell padding={4}>
                    <Skeleton height="20px" width="80px" />
                  </TableCell>
                </TableRow>
              ))
          ) : taskList.length > 0 ? (
            taskList.map((task) => (
              <TableRow
                key={task.id}
                cursor="pointer"
                onClick={() => handleTaskClick(task.id)}
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                borderColor="gray.700"
                backgroundColor="white"
                fontSize="sm"
              >
                <TableCell padding={4} color="text.default">
                  {task.title}
                </TableCell>
                <TableCell padding={4} color="text.default">
                  {task.description?.length > 50
                    ? `${task.description.substring(0, 50)}...`
                    : task.description || "-"}
                </TableCell>
                <TableCell padding={4} color="text.default">
                  <Flex gap={2} wrap="wrap">
                    {task.tags?.map((tag) => (
                      <TagItem
                        key={tag.id}
                        id={tag.id}
                        name={tag.name}
                        size="sm"
                      />
                    ))}
                  </Flex>
                </TableCell>
                <TableCell padding={4} color="text.default" align="center">
                  <StatusTag status={task.status} size="md" />
                </TableCell>
                <TableCell padding={4} color="text.default">
                  {task.members && task.members.length > 0 ? (
                    <AvatarList members={task.members} />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell
                  padding={4}
                  color="text.default"
                  textAlign="center"
                  fontSize="xs"
                >
                  {task.start_at || "-"}
                </TableCell>
                <TableCell
                  padding={4}
                  color="text.default"
                  textAlign="center"
                  fontSize="xs"
                >
                  {task.end_at || "-"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                textAlign="center"
                backgroundColor="white"
                color="text.default"
                padding={4}
              >
                업무 목록이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>

      {!isLoading && taskList.length > 0 && (
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
      )}
    </Flex>
  );
}
