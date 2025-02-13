"use client";
import { Stack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { MemberDTO } from "@/lib/interface/work";
import MemberItem from "./MemberItem";
import { TeamSpaceContext } from "@/lib/context/TeamContext";
import { fetchProjectsByTeamId } from "@/lib/api/api";
import { useTeam } from "@/lib/hooks";

export default function MemberList() {
  // const { teamSpace, setTeamSpace } = useContext(TeamSpaceContext);
  // const MemberList = teamSpace?.members || [];
  const team = useTeam();
  const memberList = team?.members || [];

  return (
    <Stack gap={3} p={4}>
      {memberList.map((member) => (
        <MemberItem key={member.id} member={member.member} />
      ))}
    </Stack>
  );
}
