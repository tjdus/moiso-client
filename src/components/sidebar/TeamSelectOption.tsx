"use client";

import { createListCollection } from "@chakra-ui/react";
import { Button, Box } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { useMemo, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TeamSpaceContext } from "@/lib/context/TeamContext";
import { TeamDTO, TeamDetailDTO } from "@/lib/interface/work";
import { useSession } from "next-auth/react";
import { fetchMyTeams, fetchTeamDetail } from "@/lib/api/api";

const baseUrl = "http://localhost:8000";

export default function TeamSelectPopOver() {
  const { data: session } = useSession();
  const { teamSpace, setTeamSpace } = useContext(TeamSpaceContext);
  const [teamList, setTeamList] = useState<TeamDTO[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [teamID, setTeamId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchMyTeams();
        setTeamList(data);
      } catch (error) {
        console.error("팀 목록 가져오기 실패:", error);
      }
    };

    loadTeams();
  }, []);

  const handleTeamChange = async (selectedId: string) => {
    setTeamId(selectedId);

    try {
      const data = await fetchTeamDetail(selectedId);
      setTeamSpace(data);
      setTeamName(data.name);
    } catch (error) {
      console.error("팀 정보 조회 실패:", error);
    }
  };

  const teams = useMemo(() => {
    return createListCollection({
      items: teamList || [],
      itemToString: (item: TeamDTO) => item.name,
      itemToValue: (item: TeamDTO) => item.id,
    });
  }, [teamList]);

  return (
    <Box width="100%">
      <SelectRoot
        collection={teams}
        size="md"
        color="black"
        onValueChange={(e) => handleTeamChange(e.value)}
      >
        <SelectTrigger>
          <SelectValueText padding={4} placeholder="Team" />
        </SelectTrigger>
        <SelectContent>
          {teams.items.map((team) => (
            <SelectItem item={team} key={team.name} padding={4}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
