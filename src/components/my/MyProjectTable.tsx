"use client";

import { useEffect, useState } from "react";

import {
  ProjectDTO,
  ProjectMemberDTO,
  TaskDTO,
} from "@/lib/api/interface/fetchDTOs";
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
import { TagItem, StatusTag } from "@/components/custom-ui/Tag";
import { AvatarList } from "@/components/custom-ui/Avatar";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import { fetchMyProjectMemberList, fetchProjectList } from "@/lib/api/fetchApi";
import { InputGroup } from "../ui/input-group";

const headers = ["이름", "설명", "분류", "시작일", "종료일"];

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
    </HStack>
  );
};

export default function MyProjectTable() {
  const [projectMemberList, setProjectMemberList] = useState<
    ProjectMemberDTO[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const getProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetchMyProjectMemberList({
        searchQuery,
        page,
        pageSize,
      });
      setProjectMemberList(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("프로젝트 목록 가져오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, [page, searchQuery]);

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
          ) : projectMemberList.length > 0 ? (
            projectMemberList.map((projectMember) => (
              <TableRow
                key={projectMember.project.id}
                cursor="pointer"
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <TableCell padding={4}>{projectMember.project.name}</TableCell>
                <TableCell padding={4}>
                  {projectMember.project.description?.length > 50
                    ? `${projectMember.project.description.substring(0, 50)}...`
                    : projectMember.project.description || "-"}
                </TableCell>
                <TableCell padding={4}>
                  <Flex gap={2} wrap="wrap">
                    {projectMember.project.category ? (
                      <TagItem
                        id={projectMember.project.category.id}
                        name={projectMember.project.category.name}
                        size="md"
                      />
                    ) : (
                      "-"
                    )}
                  </Flex>
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({
                    dateString: projectMember.project.start_date,
                  })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({
                    dateString: projectMember.project.end_date,
                  })}
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

      {!isLoading && projectMemberList.length > 0 && (
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
    </Flex>
  );
}
