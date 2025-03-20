"use client";

import { useEffect, useState } from "react";
import { getMyTaskAssignmentList } from "@/lib/api/getApi";
import { TaskAssignmentDTO, TaskDTO } from "@/lib/api/interface/fetchDTOs";
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
import {
  RadioCardItem,
  RadioCardRoot,
  RadioCardLabel,
} from "@/components/ui/radio-card";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { LuSearch } from "react-icons/lu";
import TaskCreationDialog from "../dialog/create/TaskCreationDialog";
import TaskDetailDialog, {
  useTaskDetailDialog,
} from "../dialog/TaskDetail/TaskDetailDialog";
import { TagItem, StatusTag } from "@/components/custom-ui/Tag";
import { AvatarList } from "@/components/custom-ui/Avatar";
import { get } from "lodash";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import { ProjectButton, ProjectLink } from "../custom-ui/ProjectLink";
import { Radio, RadioGroup } from "../ui/radio";

const headers = [
  "프로젝트",
  "제목",
  "설명",
  "태그",
  "상태",
  "담당일",
  "완료일",
  "시작일",
  "마감일",
];

// const TaskStatusSelector = ({
//   onStatusChange,
// }: {
//   onStatusChange: (status: string) => void;
// }) => {
//   return (
//     <RadioCardRoot
//       onValueChange={(e) => onStatusChange(e.value)}
//       align="center"
//       justify="center"
//       maxW="sm"
//       defaultValue="all"
//     >
//       <RadioCardLabel>진행 상태</RadioCardLabel>
//       <HStack align="stretch">
//         <RadioCardItem
//           value="all"
//           indicator={false}
//           icon={<StatusTag status="all" size="md" />}
//         />
//         <RadioCardItem
//           value="not_started"
//           indicator={false}
//           icon={<StatusTag status="not_started" size="md" />}
//         />
//         <RadioCardItem
//           value="in_progress"
//           indicator={false}
//           icon={<StatusTag status="in_progress" size="md" />}
//         />
//         <RadioCardItem
//           value="completed"
//           indicator={false}
//           icon={<StatusTag status="completed" size="md" />}
//         />
//       </HStack>
//     </RadioCardRoot>
//   );
// };

const TaskStatusSelector = ({
  onStatusChange,
}: {
  onStatusChange: (status: string) => void;
}) => {
  return (
    <RadioGroup
      defaultValue="all"
      onValueChange={(e) => {
        onStatusChange(e.value);
      }}
    >
      <HStack gap={2}>
        <Radio value="all">
          <StatusTag status="all" size="md" />
        </Radio>
        <Radio value="not_started">
          <StatusTag status="not_started" size="md" />
        </Radio>
        <Radio value="in_progress">
          <StatusTag status="in_progress" size="md" />
        </Radio>
        <Radio value="completed">
          <StatusTag status="completed" size="md" />
        </Radio>
      </HStack>
    </RadioGroup>
  );
};

const TaskSearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <HStack width="40%">
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
      <IconButton
        variant="ghost"
        aria-label="Search"
        size="sm"
        boxSizing="border-box"
        colorPalette="gray"
        onClick={handleSearch}
      >
        <LuSearch size="sm" />{" "}
      </IconButton>
    </HStack>
  );
};

export default function MyTaskTable() {
  const [taskAssignmentList, setTaskAssignmentList] = useState<
    TaskAssignmentDTO[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const { setOpen, setTaskId } = useTaskDetailDialog();
  const pageSize = 10;

  const getTaskList = async () => {
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 3);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 3);

      const response = await getMyTaskAssignmentList({
        status: status !== "all" ? status : undefined,
        page,
        searchQuery,
      });
      setTaskAssignmentList(response.data.results);
      setTotalCount(response.data.count);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching task assignments:", error);
    }
  };

  useEffect(() => {
    getTaskList();
  }, [page, searchQuery, status]);

  const handleTaskClick = (selectedId: string) => {
    setTaskId(selectedId);
    setOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatus(status);
    setPage(1);
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
      <TaskStatusSelector onStatusChange={handleStatusChange} />
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
          {taskAssignmentList.length > 0 ? (
            taskAssignmentList.map((taskAssignment) => (
              <TableRow
                key={taskAssignment.id}
                cursor="pointer"
                onClick={() => handleTaskClick(taskAssignment.task.id)}
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <TableCell
                  padding={4}
                  align="center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ProjectLink
                    size="sm"
                    projectId={taskAssignment.task.project.id}
                    name={taskAssignment.task.project.name}
                  />
                </TableCell>
                <TableCell padding={4}>{taskAssignment.task.title}</TableCell>
                <TableCell padding={4}>
                  {taskAssignment.task.description?.length > 50
                    ? `${taskAssignment.task.description.substring(0, 50)}...`
                    : taskAssignment.task.description || "-"}
                </TableCell>
                <TableCell padding={4}>
                  <Flex gap={2} wrap="wrap">
                    {taskAssignment.task.tags?.map((taskTag) => (
                      <TagItem
                        key={taskTag.tag.id}
                        id={taskTag.tag.id}
                        name={taskTag.tag.name}
                        size="sm"
                      />
                    ))}
                  </Flex>
                </TableCell>
                <TableCell padding={4} align="center">
                  <StatusTag status={taskAssignment.status} size="md" />
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({
                    dateString: taskAssignment.assigned_at,
                  })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({
                    dateString: taskAssignment.completed_at,
                  })}
                </TableCell>

                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({
                    dateString: taskAssignment.task.start_at,
                  })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({
                    dateString: taskAssignment.task.end_at,
                  })}
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

      {!isLoading && taskAssignmentList.length > 0 && (
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
