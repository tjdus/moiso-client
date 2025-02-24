"use client";
import { Stack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { EmptyState, Box, HStack, Text } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { TeamSpaceContext, useTeamSpace } from "@/lib/context/TeamContext";
import { LuCircle, LuCircleAlert, LuUserRound } from "react-icons/lu";
import { MemberDTO } from "@/lib/interface/fetchDTOs";

export function MemberItem({ member }: { member: MemberDTO }) {
  return (
    <Box p={3} borderRadius="md" _hover={{ bg: "gray.100" }} gap={3}>
      <HStack>
        <Avatar name={member.name} size="sm" />
        <Text fontSize="xs" fontWeight="medium">
          {member.name}
        </Text>
      </HStack>
    </Box>
  );
}

export default function MemberList() {
  const { teamSpace, setTeamSpace } = useTeamSpace();
  const memberList = teamSpace?.members || [];

  if (!teamSpace) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuCircleAlert />
          </EmptyState.Indicator>
          <EmptyState.Description>팀을 선택하세요</EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  if (!memberList.length) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuUserRound />
          </EmptyState.Indicator>
          <EmptyState.Description>
            아직 팀에 아무도 없어요
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  return (
    <Stack gap={3} p={4}>
      {memberList.map((member) => (
        <MemberItem key={member.id} member={member.member} />
      ))}
    </Stack>
  );
}
