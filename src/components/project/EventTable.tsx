"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EventDTO } from "@/lib/api/interface/fetchDTOs";
import {
  TableRoot,
  TableBody,
  TableRow,
  TableCell,
  Flex,
  HStack,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import SearchBox from "../custom-ui/SearchBox";
import EventCreationDialog from "../dialog/create/EventCreationDialog";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import { getEventList } from "@/lib/api/getApi";
import { Avatar, AvatarGroup } from "../ui/avatar";

export default function EventTable({ projectId }: { projectId: string }) {
  const [eventList, setEventList] = useState<EventDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;
  
  const router = useRouter();

  const getEvents = async () => {
    try {
      const response = await getEventList({
        searchQuery,
        page,
        pageSize,
        projectId,
      });
      setEventList(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("일정 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    getEvents();
  }, [projectId, page, searchQuery]);

  const handleEventClick = (id: string) => {
    router.push(`/workspace/event/${id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
      <Flex justify="space-between" align="center">
        <EventCreationDialog projectId={projectId} />
        <SearchBox onSearch={handleSearch} />
      </Flex>
      <TableRoot size="lg" borderRadius="md" border="1px">
        <TableBody>
          {eventList.length > 0 ? (
            eventList.map((event) => (
              <TableRow
                key={event.id}
                cursor="pointer"
                onClick={() => handleEventClick(event.id)}
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <TableCell padding={4}>{event.title}</TableCell>
                <TableCell padding={4}>
                  {event.members.map((member) => {
                    return (
                      <AvatarGroup gap="0" spaceX="-3" size="sm">
                        <Avatar name={member.name} />
                      </AvatarGroup>
                    )
                  })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {event.location}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({ dateString: event.start_at })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatDateTimeKST({ dateString: event.end_at })}
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

      {eventList.length > 0 && (
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
