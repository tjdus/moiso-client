"use client";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";

interface MemberDTO {
  name: string;
  role: string;
  avatarUrl?: string; // 프로필 사진 URL (선택적)
}

export default function MemberItem({ member }: { member: MemberDTO }) {
  return (
    <Flex
      align="center"
      p={3}
      borderRadius="md"
      bg="white"
      _hover={{ bg: "gray.100" }}
      gap={3}
    >
      {/* Avatar */}
      <Avatar name={member.name} src={member.avatarUrl} size="sm" />

      {/* 이름 및 역할 */}
      <Box>
        <Text fontSize="xs" fontWeight="bold">{member.name}</Text>
      </Box>
    </Flex>
  );
}
