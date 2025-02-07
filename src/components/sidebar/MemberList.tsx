"use client";
import { Stack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { MemberDTO } from "@/lib/interface/work";
import MemberItem from "./MemberItem";
import { TeamSpaceContext } from "@/lib/context/TeamContext";
import { fetchProjectsByTeamId } from "@/lib/api/api";

export default function MemberList() {
  const { teamSpace, setTeamSpace } = useContext(TeamSpaceContext);
  const MemberList = teamSpace?.members || [];

  return (
    <Stack gap={3} p={4}>
      {MemberList.map((member) => (
        <MemberItem key={member.id} member={member.member} />
      ))}
    </Stack>
  );
}
