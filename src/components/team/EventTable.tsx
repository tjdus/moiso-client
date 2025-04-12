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
  IconButton,
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
import EventEditDialog from "../dialog/EventDetail/EventEditDialog";
import { toaster } from "../ui/toaster";
import { deleteEvent } from "@/lib/api/deleteApi";
import { LuTrash2 } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";

export default function EventTable({ teamId }: { teamId: string }) {
  const [eventList, setEventList] = useState<EventDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventId, setEventId] = useState<null | string>(null);
  const pageSize = 10;
  
  const router = useRouter();

  const getEvents = async () => {
    try {
      const response = await getEventList({
        searchQuery,
        page,
        pageSize,
        teamId,
      });
      setEventList(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("일정 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    getEvents();
  }, [teamId, page, searchQuery]);

  const handleEventClick = (id: string) => {
    router.push(`/workspace/event/${id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    try {
      await deleteEvent(id);
      toaster.success({
        title: "일정 삭제 성공",
        description: "일정이 삭제되었습니다",
      })
    } catch (error) {
      toaster.error({
        title: "일정 삭제 실패",
        description: "일정 삭제에 실패하였습니다",
      });
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setIsDialogOpen(true);
    setEventId(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEventId(null);
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
        <EventCreationDialog teamId={teamId} />
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
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  <IconButton 
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {handleDelete(e, event.id)}} 
                    colorPalette="red"
                  >
                    <LuTrash2 />
                  </IconButton>
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  <IconButton  
                    colorPalette="gray" 
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {handleEdit(e, event.id)}}
                  >
                    <CiEdit />
                  </IconButton>
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

      {isDialogOpen && eventId &&
        <EventEditDialog 
          teamId={eventId} 
          isOpen={isDialogOpen} 
          onClose={handleDialogClose} 
        />
      }
    </Flex>
  );
}
