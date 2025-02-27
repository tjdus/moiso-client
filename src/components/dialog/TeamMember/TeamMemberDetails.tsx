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
  TeamMemberDTO,
} from "@/lib/api/interface/fetchDTOs";
import {
  fetchTeamGroupList,
  fetchTeamMemberDetail,
  fetchTeamMemberList,
} from "@/lib/api/fetchApi";
import { revalidatePath } from "next/cache";

const SelectTagItem = () => (
  <SelectValueText padding={2}>
    {(items: Array<{ id: string; name: string }>) => (
      <HStack>
        {items.map(({ id, name }) => (
          <HStack key={id}>
            <TagItem id={id} name={name} size="md" />
          </HStack>
        ))}
      </HStack>
    )}
  </SelectValueText>
);

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
  const [selectedTeamGroup, setSelectedTeamGroup] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectDTO[]>();

  if (!teamId) {
    return;
  }
  const getTeamMemberInfo = async () => {
    try {
      const response = await fetchTeamMemberDetail(teamMemberId);
      setTeamMember(response.data);
    } catch (error) {
      console.error("Failed to fetch team member details", error);
    }
  };

  const getRoleGroups = async () => {
    try {
      const response = await fetchTeamGroupList({ teamId: teamId });
      console.log(response);
      setTeamGroupList(response.data.results);
    } catch (error) {
      console.error("Failed to fetch role groups", error);
    }
  };

  useEffect(() => {
    if (teamGroupList.length > 0) {
      setSelectedTeamGroup(teamGroupList.map((teamGroup) => teamGroup.id));
    }
  }, [teamGroupList]);

  useEffect(() => {
    getTeamMemberInfo();
    getRoleGroups();
  }, [teamId, teamMemberId]);

  const handleCommit = async () => {
    try {
      const response = await updateTeamMember({
        teamMemberId: teamMemberId,
        teamGroups: selectedTeamGroup,
      });
      getTeamMemberInfo();
      const updated_data = await fetchTeamMemberDetail(teamMemberId);
      onUpdate(teamMemberId, updated_data.data);
    } catch (error) {
      console.error("Failed to commit changes", error);
    }
  };

  const teamGroupCollections = useMemo(() => {
    return createListCollection({
      items: teamGroupList || [],
      itemToString: (item: TeamGroupDTO) => item.name,
      itemToValue: (item: TeamGroupDTO) => item.id,
    });
  }, [teamGroupList]);

  return (
    <Card.Root padding={10}>
      <Card.Body>
        <DataList.Root orientation="horizontal">
          <DataList.Item>
            <DataList.ItemLabel>이름</DataList.ItemLabel>
            <DataList.ItemValue>{teamMember?.member.name}</DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel>이메일</DataList.ItemLabel>
            <DataList.ItemValue>{teamMember?.member.email}</DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel>역할</DataList.ItemLabel>
            <DataList.ItemValue>
              <Editable.Root
                onValueRevert={() => setSelectedTeamGroup([])}
                onValueCommit={handleCommit}
                display="flex"
              >
                <SelectRoot
                  multiple
                  collection={teamGroupCollections}
                  value={selectedTeamGroup}
                  onValueChange={(selectedItem) => {
                    setSelectedTeamGroup(
                      selectedItem.items.map((item) => item.id)
                    );
                  }}
                >
                  <Editable.Area>
                    <Editable.Context>
                      {(editable) =>
                        editable.editing ? (
                          <>
                            <SelectTrigger>
                              <SelectTagItem />
                            </SelectTrigger>
                            <Editable.Control>
                              <SelectContent
                                portalled={false}
                                padding={2}
                                gap={2}
                              >
                                {teamGroupCollections.items.map((roleGroup) => (
                                  <SelectItem
                                    item={roleGroup}
                                    key={roleGroup.id}
                                  >
                                    <TagItem
                                      key={roleGroup.id}
                                      id={roleGroup.id}
                                      name={roleGroup.name}
                                      size="md"
                                    />
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Editable.Control>
                          </>
                        ) : (
                          <>
                            {teamGroupList.map((teamGroup) => (
                              <TagItem
                                key={teamGroup.id}
                                id={teamGroup.id}
                                name={teamGroup.name}
                                size="md"
                              />
                            ))}
                          </>
                        )
                      }
                    </Editable.Context>
                  </Editable.Area>
                </SelectRoot>
                <Editable.Control>
                  <Editable.EditTrigger asChild>
                    <IconButton variant="ghost" size="xs">
                      <LuPencilLine />
                    </IconButton>
                  </Editable.EditTrigger>
                  <Editable.CancelTrigger asChild>
                    <IconButton variant="ghost" size="xs">
                      <LuX />
                    </IconButton>
                  </Editable.CancelTrigger>
                  <Editable.SubmitTrigger asChild>
                    <IconButton variant="ghost" size="xs">
                      <LuCheck />
                    </IconButton>
                  </Editable.SubmitTrigger>
                </Editable.Control>
              </Editable.Root>
            </DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel>권한</DataList.ItemLabel>
            <DataList.ItemValue>
              <RoleBadge role={teamMember?.role as Role} />
            </DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel>가입일</DataList.ItemLabel>
            <DataList.ItemValue>{teamMember?.joined_at}</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default TeamMemberDetails;
