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
  Tag,
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
  ProjectDTO,
  ProjectMemberDTO,
  TeamMemberDetailDTO,
  TeamMemberInfoDTO,
} from "@/lib/interface/fetchDTOs";

import { Avatar } from "../ui/avatar";
import { ProjectMemberInfoDTO } from "@/lib/interface/fetchDTOs";
import { RoleBadge } from "../custom-ui/RoleBadge";
import type { Role } from "@/lib/interface/common";
import { useEffect, useState } from "react";
import {
  fetchProjectMembers,
  fetchProjects,
  fetchTeamMemberDetail,
  fetchTeamMembers,
} from "@/lib/api/fetchApi";
import TeamMemberDetailDialog from "../dialog/TeamMember/TeamMemberDetailDialog";
import { set } from "lodash";

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

const headers = ["이름", "이메일", "역할", "프로젝트", "가입일"];

export default function TeamMemberTable({ teamId }: { teamId: string }) {
  const [memberList, setMemberList] = useState<TeamMemberDetailDTO[]>([]);
  const [memberDetails, setMemberDetails] =
    useState<TeamMemberDetailDTO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTeamMemberDetail({
          teamId,
          page: currentPage,
          pageSize: pageSize,
        });
        setMemberList(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("프로젝트 멤버 목록 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [teamId, currentPage]);

  const handleMemberClick = (details: TeamMemberDetailDTO) => {
    setIsDialogOpen(true);
    setMemberDetails(details);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setMemberDetails(null);
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
          ) : memberList.length > 0 ? (
            memberList.map((details) => (
              <TableRow
                key={details.member.id}
                cursor="pointer"
                onClick={() => handleMemberClick(details)}
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <TableCell align="center" height="48px">
                  <HStack padding={2} gap={2} align="center">
                    <Avatar size="xs" />
                    <Text fontWeight="light" fontSize="sm">
                      {details.member.member.name}
                    </Text>
                  </HStack>
                </TableCell>

                <TableCell fontSize="xs" textAlign="center" height="48px">
                  {details.member.member.email}
                </TableCell>

                <TableCell textAlign="center" height="48px">
                  {details.role_groups && details.role_groups.length > 0 ? (
                    <VStack gap={2} justify="center">
                      {details.role_groups.map((roleGroup) => (
                        <Tag.Root key={roleGroup.id}>
                          <Tag.Label>{roleGroup.name}</Tag.Label>
                        </Tag.Root>
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="xs" textAlign="center">
                      없음
                    </Text>
                  )}
                </TableCell>

                <TableCell textAlign="center">
                  {details.projects && details.projects.length > 0 ? (
                    <VStack gap={2} justify="center">
                      {details.projects.map((project) => (
                        <Badge key={project.id} colorScheme="blue">
                          {project.name}
                        </Badge>
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="xs" textAlign="center">
                      없음
                    </Text>
                  )}
                </TableCell>

                <TableCell fontSize="xs" textAlign="center" height="48px">
                  {details.member.joined_at}
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

      {!isLoading && memberList.length > 0 && (
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

      {isDialogOpen && memberDetails && (
        <TeamMemberDetailDialog
          details={memberDetails}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </Flex>
  );
}
