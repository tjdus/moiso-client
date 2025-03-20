"use client";

import { useEffect, useState } from "react";

import { TaskDTO } from "@/lib/api/interface/fetchDTOs";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableColumnHeader,
  TableRow,
  TableCell,
  Flex,
  HStack,
  IconButton,
  Input,
  Separator,
  useDialog,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { LuSearch } from "react-icons/lu";
import TaskCreationDialog from "../dialog/create/TaskCreationDialog";
import TaskDetailDialog, {
  useTaskDetailDialog,
} from "../dialog/TaskDetail/TaskDetailDialog";
import { TagItem, StatusTag } from "@/components/custom-ui/Tag";
import { AvatarList } from "@/components/custom-ui/Avatar";
import { getTaskList } from "@/lib/api/getApi";
import { InputGroup } from "../ui/input-group";

const headers = ["제목", "설명", "태그", "상태", "담당자", "시작일", "마감일"];

const TaskSearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <HStack width="40%">
      <InputGroup
        flex="1"
        startElement={<LuSearch style={{ marginLeft: "8px" }} />}
      >
        <Input
          padding={2}
          colorPalette="gray"
          variant="outline"
          placeholder="검색하기"
          size="sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </InputGroup>
      <TaskCreationDialog />
    </HStack>
  );
};

export default function TaskList({ projectId }: { projectId: string }) {
  const [taskList, setTaskList] = useState<TaskDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { setTaskId, setOpen } = useTaskDetailDialog();
  const pageSize = 10;

  const getTasks = async () => {
    try {
      const response = await getTaskList({
        projectId,
        searchQuery,
        page,
        pageSize,
      });
      setTaskList(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("업무 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, [projectId, page, searchQuery]);

  const handleTaskClick = (selectedId: string) => {
    setTaskId(selectedId);
    setOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
  };

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
      <Flex justify="end" align="center">
        <TaskSearchBar onSearch={handleSearch} />
      </Flex>
      <Separator />
      <TableRoot size="lg" borderRadius="md" border="1px">
        <TableHeader fontSize="sm" textAlign="center">
          <TableRow>
            {headers.map((header, index) => (
              <TableColumnHeader
                key={index}
                padding={4}
                borderBottom="2px"
                textAlign="center"
              >
                {header}
              </TableColumnHeader>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskList.length > 0 ? (
            taskList.map((task) => (
              <TableRow
                key={task.id}
                cursor="pointer"
                onClick={() => handleTaskClick(task.id)}
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <TableCell padding={4}>{task.title}</TableCell>
                <TableCell padding={4}>
                  {task.description?.length > 50
                    ? `${task.description.substring(0, 50)}...`
                    : task.description || "-"}
                </TableCell>
                <TableCell padding={4}>
                  <Flex gap={2} wrap="wrap">
                    {task.tags?.map((taskTag) => (
                      <TagItem
                        key={taskTag.id}
                        id={taskTag.tag.id}
                        name={taskTag.tag.name}
                        size="sm"
                      />
                    ))}
                  </Flex>
                </TableCell>
                <TableCell padding={4} align="center">
                  <StatusTag status={task.status} size="md" />
                </TableCell>
                <TableCell padding={4}>
                  {task.members && task.members.length > 0 ? (
                    <AvatarList
                      members={task.members.map((member) => member.member)}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {task.start_at
                    ? new Date(task.start_at)
                        .toLocaleString("ko-KR", {
                          timeZone: "Asia/Seoul",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        .replace(" 00:00", "")
                    : "-"}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {task.end_at
                    ? new Date(task.end_at)
                        .toLocaleString("ko-KR", {
                          timeZone: "Asia/Seoul",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        .replace(" 00:00", "")
                    : "-"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} textAlign="center" padding={4}>
                업무 목록이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>
      {taskList.length > 0 && (
        <PaginationRoot
          count={totalCount}
          pageSize={pageSize}
          page={page}
          defaultPage={1}
          onPageChange={(e) => setPage(e.page)}
        >
          <HStack justify="center">
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      )}
      <TaskDetailDialog />
    </Flex>
  );
}
