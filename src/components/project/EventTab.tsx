
import { EventDTO } from "@/lib/api/interface/fetchDTOs";
import { Flex, Text, Separator } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "../ui/avatar";
import { deleteEvent } from "@/lib/api/deleteApi";
import { toaster } from "../ui/toaster";
import { useRouter } from "next/navigation";
import { DeleteButton } from "../custom-ui/SaveDeleteButton";


export default function EventTab({ event, eventId } : { event: EventDTO | null, eventId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteEvent(eventId);
      toaster.success({
        title: "일정 삭제 성공",
        description: "일정이 삭제되었습니다",
      })
      router.push("/workspace");
    } catch (error) {
      toaster.error({
        title: "일정 삭제 실패",
        description: "일정 삭제에 실패하였습니다",
      });
    }
  };

  return (
    <>
      {event ? <Flex
        direction="column"
        gap="1"
        position="sticky"
        top="0"
        zIndex="2"
        height="100vh"
        overflow="auto"
        margin="12"
      >
        <Text fontSize="xl" fontWeight="bold" >
          {event.title}
        </Text>
        <DeleteButton onDelete={handleDelete} />
        <div style={{fontSize: "14px"}}>
          <Flex gap="5" paddingTop="1" paddingBottom="1">
            <Text>시작</Text>
            <Text>{event.start_at}</Text>
          </Flex>
          <Separator width="30%" />
          <Flex gap="5" paddingTop="1" paddingBottom="1">
            <Text>종료</Text>
            <Text>{event.end_at}</Text>
          </Flex>
          <Separator width="30%" />
          <Flex gap="5" paddingTop="1" paddingBottom="1">
            <Text>장소</Text>
            <Text>{event.location}</Text>
          </Flex>
          <Separator width="30%" />
          <Flex gap="5" paddingTop="1" paddingBottom="1">
            <Text>인원</Text>
            <AvatarGroup gap="0" spaceX="-3" size="sm">
              {event.members.map((member) => 
                <Avatar name={member.name} />
              )}
            </AvatarGroup>
          </Flex>
        </div>
        <Text marginTop="3">
          {event.description}
        </Text>
      </Flex> :
      <></>}
    </>
  );
}