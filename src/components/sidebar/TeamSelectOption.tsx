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
import { useMemo, useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TeamSpaceContext, useTeamSpace } from "@/lib/context/TeamContext";
import { TeamDTO, TeamDetailDTO } from "@/lib/interface/fetchDTOs";
import { fetchMyTeams, fetchTeamDetail } from "@/lib/api/fetchApi";
import TeamCreationDialog from "../dialog/create/TeamCeationDialog";

export default function TeamSelectOption() {
  const { teamSpace, setTeamSpace } = useTeamSpace();
  const [teamList, setTeamList] = useState<TeamDTO[]>([]);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetchMyTeams();
        setTeamList(response.data);
      } catch (error) {
        console.error("팀 목록 가져오기 실패:", error);
      }
    };

    loadTeams();
  }, []);

  const handleTeamChange = async (selectedId: string) => {
    try {
      const response = await fetchTeamDetail(selectedId);
      setTeamSpace(response.data);
    } catch (error) {
      console.error("팀 정보 조회 실패:", error);
    }
  };

  const teamCollection = useMemo(() => {
    return createListCollection({
      items: teamList || [],
      itemToString: (item: TeamDTO) => item.name,
      itemToValue: (item: TeamDTO) => item.id,
    });
  }, [teamList]);

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
        {teamCollection.items.map((team) => (
          <SelectItem
            item={team}
            key={team.id}
            padding={4}
            _light={{ bg: "gray.100", color: "black" }}
            _dark={{ bg: "gray.700", color: "white" }}
          >
            {team.name}
          </SelectItem>
        ))}
        <TeamCreationDialog />
      </SelectContent>
    </SelectRoot>
  );
}
