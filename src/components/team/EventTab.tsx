
import { EventDTO } from "@/lib/api/interface/fetchDTOs";
import { Flex, Text, Separator } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "../ui/avatar";

export default function EventTab({ event } : { event: EventDTO | null }) {
  const convertISOString = (date: string | null) => {
    if (!date) return "-";
    return `${date.slice(0, 4)}.${date.slice(5, 7)}.${date.slice(8, 10)} ${date.slice(11, 19)}`;
  }

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
        <div style={{fontSize: "14px"}}>
          <Flex gap="5" paddingTop="1" paddingBottom="1">
            <Text>시작</Text>
            <Text>{convertISOString(event.start_at)}</Text>
          </Flex>
          <Separator width="30%" />
          <Flex gap="5" paddingTop="1" paddingBottom="1">
            <Text>종료</Text>
            <Text>{convertISOString(event.end_at)}</Text>
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