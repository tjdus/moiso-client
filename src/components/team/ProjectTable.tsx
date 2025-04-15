"use client";

import { useEffect, useState } from "react";

import { ProjectDTO, TaskDTO } from "@/lib/api/interface/fetchDTOs";
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
import SearchBox from "../custom-ui/SearchBox";
import ProjectCreationDialog from "../dialog/create/ProjectCreationDialog";
import { TagItem, StatusTag } from "@/components/custom-ui/Tag";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import { getProjectList } from "@/lib/api/getApi";
import ProjectDetailDialog from "../dialog/ProjectDetail/ProjectDetailDialog";

const headers = ["이름", "설명", "분류", "시작일", "종료일"];

export default function ProjectTable({ teamId }: { teamId: string }) {
  const [projectList, setProjectList] = useState<ProjectDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pageSize = 10;

  const getProjects = async () => {
    try {
      const response = await getProjectList({
        searchQuery,
        page,
        pageSize,
        teamId,
      });
      setProjectList(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("프로젝트 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    getProjects();
  }, [teamId, page, searchQuery]);

  const handleProjectClick = (id: string) => {
    setProjectId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setProjectId(null);
    getProjects();
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
      <Flex justify="space-between" align="center">
        <ProjectCreationDialog teamId={teamId} />
        <SearchBox onSearch={handleSearch} />
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
          {projectList.length > 0 ? (
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
                  {formatDateTimeKST({ dateString: project.start_date })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({ dateString: project.end_date })}
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

      {projectList.length > 0 && (
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

      {isDialogOpen && projectId && (
        <ProjectDetailDialog
          teamId={teamId}
          projectId={projectId}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </Flex>
  );
}
