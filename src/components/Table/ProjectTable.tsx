"use client";

import { useEffect, useState } from "react";
import { fetchProjects, fetchTasksByProjectId } from "@/lib/api/fetchApi";
import { ProjectDTO, TaskDTO } from "@/lib/interface/fetchDTOs";
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
import TaskDetailDialog from "../dialog/TaskDetail/TaskDetailDialog";
import { TagItem, StatusTag } from "@/components/custom-ui/Tag";
import { AvatarList } from "@/components/custom-ui/Avatar";
import { formatToKST } from "@/lib/util/dateFormat";
import { format } from "path";

const headers = ["이름", "설명", "분류", "시작일", "종료일"];

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

export default function ProjectTable({ teamId }: { teamId: string }) {
  const [projectList, setProjectList] = useState<ProjectDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProjects({
          searchQuery,
          page: currentPage,
          pageSize,
          teamId,
        });
        setProjectList(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("프로젝트 목록 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [teamId, currentPage, searchQuery]);

  const handleProjectClick = (id: string) => {
    setProjectId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setProjectId(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
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
      <Flex justify="space-between" align="center">
        <TaskCreationDialog />
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
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={`loading-${index}`} borderBottom="1px">
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
          ) : projectList.length > 0 ? (
            projectList.map((project) => (
              <TableRow
                key={project.id}
                cursor="pointer"
                onClick={() => handleProjectClick(project.id)}
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <TableCell padding={4}>{project.name}</TableCell>
                <TableCell padding={4}>
                  {project.description?.length > 50
                    ? `${project.description.substring(0, 50)}...`
                    : project.description || "-"}
                </TableCell>
                <TableCell padding={4}>
                  <Flex gap={2} wrap="wrap">
                    {project.category ? (
                      <TagItem
                        id={project.category.id}
                        name={project.category.name}
                        size="md"
                      />
                    ) : (
                      "-"
                    )}
                  </Flex>
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatToKST({ dateString: project.start_date })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatToKST({ dateString: project.end_date })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} textAlign="center" padding={4}>
                프로젝트 목록이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>

      {!isLoading && projectList.length > 0 && (
        <PaginationRoot
          count={totalCount}
          pageSize={pageSize}
          page={currentPage}
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

      {isDialogOpen && projectId && (
        <TaskDetailDialog
          taskId={projectId}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </Flex>
  );
}
