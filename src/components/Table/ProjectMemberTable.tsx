"use client";

import {
  TableRoot,
  TableHeader,
  TableBody,
  TableColumnHeader,
  TableRow,
  TableCell,
  Badge,
  VStack,
  HStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { useProject } from "@/lib/hooks";
import {
  ProjectDetailDTO,
  ProjectMemberDTO,
} from "@/lib/api/interface/fetchDTOs";

import { Avatar } from "../ui/avatar";
import { ProjectMemberInfoDTO } from "@/lib/api/interface/fetchDTOs";
import { RoleBadge } from "../custom-ui/RoleBadge";
import type { Role } from "@/lib/api/interface/common";
import { useEffect, useState } from "react";
import { fetchProjectMemberList } from "@/lib/api/fetchApi";

const ProjectMemberRow = ({
  id,
  member,
  role,
  joined_at,
}: ProjectMemberInfoDTO) => {
  return (
    <TableRow _hover={{ bg: "gray.300" }}>
      <TableCell align="center" height="48px">
        <HStack>
          <Avatar size="xs" />
          <Text fontWeight="light" fontSize="sm">
            {member.name}
          </Text>
        </HStack>
      </TableCell>

      <TableCell fontSize="xs" textAlign="center" height="48px">
        {member.email}
      </TableCell>

      <TableCell textAlign="center" height="48px">
        <RoleBadge role={role as Role} />
      </TableCell>

      <TableCell fontSize="xs" textAlign="center" height="48px">
        {joined_at}
      </TableCell>
    </TableRow>
  );
};

const headers = ["이름", "이메일", "역할", "가입일"];

export default function ProjectMemberTable({
  projectId,
}: {
  projectId: string;
}) {
  const [projectMemberList, setProjectMemberList] = useState<
    ProjectMemberDTO[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProjectMemberList({
          projectId,
          page,
          pageSize,
        });
        console.log(response);
        setProjectMemberList(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("프로젝트 멤버 목록 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [projectId, page]);

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
      <TableRoot size="lg" borderRadius="md" border="1px">
        <TableHeader fontSize="sm" textAlign="center">
          <TableRow>
            {headers.map((header, index) => (
              <TableColumnHeader
                key={index}
                padding={4}
                textAlign="center"
                height="48px"
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
                    <SkeletonText width="100%" />
                  </TableCell>
                  <TableCell padding={4}>
                    <SkeletonText noOfLines={2} gap="2" width="200px" />
                  </TableCell>
                  <TableCell padding={4}>
                    <Flex gap={2}>
                      <Skeleton height="20px" width="60px" />
                      <Skeleton height="20px" width="60px" />
                    </Flex>
                  </TableCell>
                  <TableCell padding={4}>
                    <Skeleton height="20px" width="80px" />
                  </TableCell>
                </TableRow>
              ))
          ) : projectMemberList.length > 0 ? (
            projectMemberList.map((projectMember) => (
              <TableRow key={projectMember.id} _hover={{ bg: "gray.300" }}>
                <TableCell align="center" height="48px">
                  <HStack padding={2} gap={2} align="center">
                    <Avatar size="xs" />
                    <Text fontWeight="light" fontSize="sm">
                      {projectMember.member.name}
                    </Text>
                  </HStack>
                </TableCell>

                <TableCell fontSize="xs" textAlign="center" height="48px">
                  {projectMember.member.email}
                </TableCell>

                <TableCell textAlign="center" height="48px">
                  <RoleBadge role={projectMember.role as Role} />
                </TableCell>

                <TableCell fontSize="xs" textAlign="center" height="48px">
                  {projectMember.joined_at}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} textAlign="center" padding={4}>
                멤버가 없습니다.
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
