"use client";

import { Card, createListCollection } from "@chakra-ui/react";
import { Button, Box } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { useMemo, useEffect, useState } from "react";
import { useTeamSpace } from "@/lib/context/TeamSpaceContext";
import { TeamMemberDTO } from "@/lib/api/interface/fetchDTOs";

import TeamCreationDialog from "../dialog/create/TeamCeationDialog";
import { getMyTeamMemberList, getTeamDetail } from "@/lib/api/getApi";

export default function TeamSelectOption() {
  const { teamSpace, setTeamSpace } = useTeamSpace();
  const [teamMemberList, setTeamMemberList] = useState<TeamMemberDTO[]>([]);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const response = await getMyTeamMemberList({});
        setTeamMemberList(response.data.results);
      } catch (error) {
        console.error("팀 목록 가져오기 실패:", error);
      }
    };

    getTeams();
  }, []);

  const handleTeamChange = async (teamId: string) => {
    try {
      const response = await getTeamDetail(teamId);
      setTeamSpace(response.data);
    } catch (error) {
      console.error("팀 정보 조회 실패:", error);
    }
  };

  const teamCollection = useMemo(() => {
    return createListCollection({
      items: teamMemberList || [],
      itemToString: (item: TeamMemberDTO) => item.team.name,
      itemToValue: (item: TeamMemberDTO) => item.team.id,
    });
  }, [teamMemberList]);

  return (
    <SelectRoot
      collection={teamCollection}
      variant="outline"
      size="md"
      onValueChange={(e) => handleTeamChange(e.value[0])}
    >
      <SelectTrigger>
        <SelectValueText padding={4} placeholder={teamSpace?.name || ""} />
      </SelectTrigger>
      <SelectContent>
        {teamCollection.items.map((teamMember) => (
          <SelectItem
            item={teamMember}
            key={teamMember.team.id}
            padding={4}
            _light={{ bg: "gray.100", color: "black" }}
            _dark={{ bg: "gray.700", color: "white" }}
          >
            {teamMember.team.name}
          </SelectItem>
        ))}
        <TeamCreationDialog />
      </SelectContent>
    </SelectRoot>
  );
}
