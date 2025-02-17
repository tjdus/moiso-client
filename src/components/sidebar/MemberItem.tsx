"use client";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { MemberDTO } from "@/lib/interface/fetchDTOs";

export default function MemberItem({ member }: { member: MemberDTO }) {
  return (
    <Flex
      align="center"
      p={3}
      borderRadius="md"
      _hover={{ bg: "gray.100" }}
      gap={3}
    >
      {/* Avatar */}
      <Avatar name={member.name} size="sm" />

      {/* 이름 및 역할 */}
      <Box>
        <Text fontSize="xs" fontWeight="bold">
          {member.name}
        </Text>
      </Box>
    </Flex>
  );
}
