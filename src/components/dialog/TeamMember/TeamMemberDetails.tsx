"use client";

import { useState, useEffect, useMemo, use } from "react";

import {
  Card,
  Center,
  DataList,
  Editable,
  Flex,
  HStack,
  IconButton,
  Tag,
} from "@chakra-ui/react";
import { RoleBadge } from "../../custom-ui/RoleBadge";
import { Role } from "@/lib/api/interface/common";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { TagItem } from "@/components/custom-ui/Tag";
import { createListCollection } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { updateTeamMember } from "@/lib/api/patchApi";
import { set } from "lodash";
import {
  ProjectDTO,
  TeamGroupDTO,
  TeamGroupMemberDTO,
  TeamMemberDTO,
} from "@/lib/api/interface/fetchDTOs";
import {
  getTeamGroupList,
  getTeamGroupMemberList,
  getTeamMemberDetail,
  getTeamMemberList,
} from "@/lib/api/getApi";
import { revalidatePath } from "next/cache";
import { TeamMemberInput } from "@/lib/api/interface/requestDTO";
import EditableData from "@/components/custom-ui/EditableData";
import TeamGroupSelector from "@/components/custom-ui/TeamGroupSelector";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { on } from "events";

interface TeamMemberDetailsProps {
  teamMemberId: string;
  onUpdate: (teamMemberId: string, updatedData: TeamMemberDTO) => void;
}

const TeamMemberDetails = ({
  teamMemberId,
  onUpdate,
}: TeamMemberDetailsProps) => {
  const params = useParams();
  const teamId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [teamMember, setTeamMember] = useState<TeamMemberDTO | null>(null);
  const [teamGroupList, setTeamGroupList] = useState<TeamGroupDTO[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    control,
  } = useForm<TeamMemberInput>();

  if (!teamId) {
    return;
  }
  const getTeamMemberInfo = async () => {
    try {
      const response = await getTeamMemberDetail(teamMemberId);
      setTeamMember(response.data);
      setValue(
        "team_groups",
        response.data?.team_groups.map((group) => group.team_group.id) || []
      );
    } catch (error) {
      console.error("Failed to fetch team member details", error);
    }
  };

  const getMemberGroups = async () => {
    try {
      const response = await getTeamGroupList({
        teamId: teamId,
      });
      setTeamGroupList(response.data.results);
    } catch (error) {
      console.error("Failed to fetch role groups", error);
    }
  };

  const onSubmit = async (
    name: keyof TeamMemberInput,
    data: TeamMemberInput
  ) => {
    try {
      const response = updateTeamMember(teamMemberId, { [name]: data[name] });
      toaster.promise(response, {
        success: {
          title: "수정되었습니다",
        },
        error: {
          title: "수정 중 문제가 발생했습니다",
        },
        loading: {
          title: "수정 중...",
        },
      });
      await response;
      getTeamMemberInfo();
    } catch (error) {
      console.error("Failed to update team member", error);
    }
  };

  const handleChange = (key: keyof TeamMemberInput, value: any) => {
    setValue(key, value);
  };

  useEffect(() => {
    getTeamMemberInfo();
    getMemberGroups();
  }, [teamId, teamMemberId]);

  return (
    <Card.Root padding={10}>
      <Card.Body>
        <form>
          <DataList.Root orientation="horizontal">
            <DataList.Item>
              <DataList.ItemLabel>이름</DataList.ItemLabel>
              <DataList.ItemValue>{teamMember?.member.name}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>이메일</DataList.ItemLabel>
              <DataList.ItemValue>
                {teamMember?.member.email}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>역할</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name={"team_groups"}
                  control={control}
                  onValueCommit={handleSubmit((data) =>
                    onSubmit("team_groups", data)
                  )}
                  onValueRevert={() => {
                    handleChange(
                      "team_groups",
                      teamMember?.team_groups.map(
                        (group) => group.team_group.id
                      ) || []
                    );
                  }}
                  edit={(value, onChange) => (
                    <TeamGroupSelector
                      teamId={teamId}
                      value={value}
                      onValueChange={(items) => {
                        onChange(items);
                      }}
                    />
                  )}
                  preview={(value) => (
                    <>
                      {Array.isArray(value) &&
                      value.length > 0 &&
                      teamGroupList.length > 0
                        ? teamGroupList
                            .filter((item) =>
                              value.some((id) => id === item.id)
                            )
                            .map((teamGroupMember) => (
                              <TagItem
                                key={teamGroupMember.id}
                                id={teamGroupMember.id}
                                name={teamGroupMember.name}
                                size="md"
                              />
                            ))
                        : null}
                    </>
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>권한</DataList.ItemLabel>
              <DataList.ItemValue>
                {teamMember?.role ? <RoleBadge role={teamMember.role} /> : "-"}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>가입일</DataList.ItemLabel>
              <DataList.ItemValue>{teamMember?.joined_at}</DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
        </form>
      </Card.Body>
    </Card.Root>
  );
};

export default TeamMemberDetails;
