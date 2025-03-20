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

import { Avatar } from "../ui/avatar";
import { TeamMemberDTO } from "@/lib/api/interface/fetchDTOs";
import { useEffect, useState } from "react";

import TeamMemberDetailDialog from "../dialog/TeamMember/TeamMemberDetailDialog";
import { TagItem } from "../custom-ui/Tag";
import { getTeamMemberList } from "@/lib/api/getApi";

const headers = ["이름", "이메일", "역할", "프로젝트", "가입일"];

export default function TeamMemberTable({ teamId }: { teamId: string }) {
  const [teamMemberList, setTeamMemberList] = useState<TeamMemberDTO[]>([]);
  const [teamMember, setTeamMember] = useState<TeamMemberDTO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pageSize = 10;

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const response = await getTeamMemberList({
        teamId,
        page: currentPage,
        pageSize: pageSize,
      });
      setTeamMemberList(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("프로젝트 멤버 목록 가져오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [teamId, currentPage]);

  const handleMemberClick = (teamMember: TeamMemberDTO) => {
    setIsDialogOpen(true);
    setTeamMember(teamMember);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setTeamMember(null);
  };
  const handleUpdateMember = async (
    teamMemberId: string,
    updatedData: TeamMemberDTO
  ) => {
    try {
      setTeamMemberList((prevList) =>
        prevList.map((teamMember) =>
          teamMember.id === teamMemberId ? updatedData : teamMember
        )
      );
    } catch (error) {
      console.error("Failed to update member:", error);
    }
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
          ) : teamMemberList.length > 0 ? (
            teamMemberList.map((teamMember) => (
              <TableRow
                key={teamMember.id}
                cursor="pointer"
                onClick={() => handleMemberClick(teamMember)}
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <TableCell align="center" height="48px">
                  <HStack padding={2} gap={2} align="center">
                    <Avatar size="xs" />
                    <Text fontWeight="light" fontSize="sm">
                      {teamMember.member.name}
                    </Text>
                  </HStack>
                </TableCell>

                <TableCell fontSize="xs" textAlign="center" height="48px">
                  {teamMember.member.email}
                </TableCell>

                <TableCell textAlign="center" height="48px">
                  {teamMember.team_groups &&
                  teamMember.team_groups.length > 0 ? (
                    <HStack gap={2} justify="center">
                      {teamMember.team_groups.map((teamGroup) => (
                        <TagItem
                          key={teamGroup.id}
                          id={teamGroup.id}
                          name={teamGroup.team_group.name}
                          size="md"
                        />
                      ))}
                    </HStack>
                  ) : (
                    <Text fontSize="xs" textAlign="center">
                      없음
                    </Text>
                  )}
                </TableCell>

                <TableCell fontSize="xs" textAlign="center" height="48px">
                  {teamMember.joined_at}
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

      {!isLoading && teamMemberList.length > 0 && (
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

      {isDialogOpen && teamMember && (
        <TeamMemberDetailDialog
          teamMember={teamMember}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onUpdate={handleUpdateMember}
        />
      )}
    </Flex>
  );
}
