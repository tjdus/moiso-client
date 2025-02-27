import { AvatarGroup, HStack, VStack, Text } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { Avatar } from "../ui/avatar";
import { MemberDTO } from "@/lib/api/interface/fetchDTOs";

const AvatarList = ({ members }: { members: MemberDTO[] }) => {
  return (
    <HStack gap={2}>
      <AvatarGroup size="xs">
        {members.map((member) => (
          <Tooltip
            key={member.id}
            ids={{ trigger: member.id }}
            content={
              <VStack gap={1} align="start" p={1}>
                <Text fontWeight="bold">{member.name}</Text>
                <Text fontSize="sm">{member.email}</Text>
              </VStack>
            }
            showArrow
            openDelay={0}
          >
            <Avatar
              key={member.id}
              ids={{ root: member.id }}
              name={member.name}
              size="xs"
              bg={getColorByMemberId(member.id)}
              variant="subtle"
            />
          </Tooltip>
        ))}
      </AvatarGroup>
      {members.length > 3 && <Text fontSize="sm">+{members.length - 3}</Text>}
    </HStack>
  );
};

const AVATAR_COLORS = [
  "red.500",
  "orange.500",
  "yellow.500",
  "green.500",
  "teal.500",
  "blue.500",
  "cyan.500",
  "purple.500",
  "pink.500",
];

const getColorByMemberId = (id: string): string => {
  let hash = 0;
  // for (let i = 0; i < id.length; i++) {
  //     hash = (hash * 31 + id.charCodeAt(i)) % AVATAR_COLORS.length;
  // }
  hash = id;

  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export { AvatarList };
