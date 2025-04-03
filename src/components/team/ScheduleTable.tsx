"use client";

import { useEffect, useState } from "react";

import { ScheduleDTO } from "@/lib/api/interface/fetchDTOs";
import {
  TableRoot,
  TableBody,
  TableRow,
  TableCell,
  Flex,
  HStack,
  IconButton,
  Input,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import SearchBox from "../custom-ui/SearchBox";
import ScheduleCreationDialog from "../dialog/create/ScheduleCreationDialog";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import { getSchduleList } from "@/lib/api/getApi";
import { Avatar, AvatarGroup } from "../ui/avatar";

export default function ScheduleTable({ teamId }: { teamId: string }) {
  const [scheduleList, setScheduleList] = useState<ScheduleDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const getSchedules = async () => {
    try {
      const response = await getSchduleList({
        searchQuery,
        page,
        pageSize,
        teamId,
      });
      setScheduleList(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("일정 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    getSchedules();
  }, [teamId, page, searchQuery]);

  const handleProjectClick = (id: string) => {
    
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
        <ScheduleCreationDialog />
        <SearchBox onSearch={handleSearch} />
      </Flex>
      <TableRoot size="lg" borderRadius="md" border="1px">
        <TableBody>
          {scheduleList.length > 0 ? (
            scheduleList.map((schedule) => (
              <TableRow
                key={schedule.id}
                cursor="pointer"
                onClick={() => handleProjectClick(schedule.id)}
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <TableCell padding={4}>{schedule.name}</TableCell>
                <TableCell padding={4}>
                  {schedule.members.map((member) => {
                    return (
                      <AvatarGroup gap="0" spaceX="-3" size="sm">
                        <Avatar name={member.member.name} />
                      </AvatarGroup>
                    )
                  })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {schedule.place}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({ dateString: schedule.start_date })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({ dateString: schedule.end_date })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} textAlign="center" padding={4}>
                일정이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>

      {scheduleList.length > 0 && (
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
