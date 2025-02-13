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
import { getSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setTeam } from "@/lib/slice/teamSlice";
import { RootState } from "@/lib/store";
import { useTeam } from "@/lib/hooks";

export default function TeamSelectPopOver() {
  //const { teamSpace, setTeamSpace } = useContext(TeamSpaceContext);
  const dispatch = useDispatch();
  const team = useTeam() as TeamDetailDTO | null;
  const teamName = team?.name || "Select Team";
  const [teamList, setTeamList] = useState<TeamDTO[]>([]);
  const [teamID, setTeamId] = useState<string>("");
  const router = useRouter();

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
    setTeamId(selectedId);

    try {
      const response = await fetchTeamDetail(selectedId);
      //TODO: Remove
      // setTeamSpace(data);
      // setTeamName(data.name);
      dispatch(setTeam(response.data));
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
        defaultValue={teamName}
        onValueChange={(e) => handleTeamChange(e.value)}
      >
        <SelectTrigger>
          <SelectValueText padding={4} placeholder={teamName || "Team"} />
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
