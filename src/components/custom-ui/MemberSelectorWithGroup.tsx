"use client";

import {
  Button,
  Card,
  createListCollection,
  Group as TeamGroup,
  HStack,
  Tag,
  Text,
  VStack,
  Box,
  EmptyState,
} from "@chakra-ui/react";
import { Select, chakraComponents } from "chakra-react-select";
import { getTeamGroupList, getTeamMemberList } from "@/lib/api/getApi";
import { useMemo, useState, useEffect } from "react";
import {
  MemberDTO,
  TeamGroupDTO,
  TeamMemberDTO,
} from "@/lib/api/interface/fetchDTOs";
import { toaster } from "../ui/toaster";
import { Avatar } from "../ui/avatar";
import _ from "lodash";
import { TagItem } from "./Tag";
import { LuUserRoundX } from "react-icons/lu";
import { TeamGroupSeparator } from "./TeamGroup";

const EmptyStateValue = () => {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <LuUserRoundX />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>빔</EmptyState.Title>
          <EmptyState.Description>더 이상 없어요.</EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
};

const SelectedMemberValue = (props: any) => {
  return (
    <chakraComponents.MultiValue {...props}>
      <HStack padding={1}>
        <Avatar name={props.data.label} size="2xs" />
        <Text>{props.data.label}</Text>
      </HStack>
    </chakraComponents.MultiValue>
  );
};

const TeamMemberGroup = (props: any) => {
  const onClick = () => {
    props.selectProps.onChange(
      _.uniqBy(
        [...props.getValue(), ...props.options],
        (option) => option.value
      )
    );
  };

  return (
    <chakraComponents.Group
      {...props}
      headingProps={{
        ...props.headingProps,
        onClick,
        _hover: { cursor: "pointer", bg: "gray.100" },
      }}
    ></chakraComponents.Group>
  );
};

const TeamMemberGroupHeading = (props: any) => {
  return (
    <chakraComponents.GroupHeading {...props} padding={1}>
      <TeamGroupSeparator label={props.data.label} />
    </chakraComponents.GroupHeading>
  );
};

const MemberItem = (props: any) => {
  const data = props.data;
  return (
    <chakraComponents.MultiValueContainer {...props}>
      <HStack _hover={{ bg: "gray.100" }} padding={2}>
        <Avatar name={data.label} size="2xs" />
        <Text>{data.label}</Text>
      </HStack>
    </chakraComponents.MultiValueContainer>
  );
};

const MemberSelectorWithGroup = ({ teamId }: { teamId: string }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberDTO[]>([]);
  const [teamGroups, setTeamGroups] = useState<TeamGroupDTO[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<MemberDTO[]>([]);

  useEffect(() => {
    getTeamMembers(teamId);
    getTeamGroups(teamId);
  }, [teamId]);

  const getTeamMembers = async (teamId: string) => {
    try {
      const response = await getTeamMemberList({ teamId });
      setTeamMembers(response.data.results);
    } catch (error) {
      toaster.error({
        title: "멤버 불러오기 실패",
        description: "멤버를 불러오는 데 실패했습니다",
      });
    }
  };

  const getTeamGroups = async (teamId: string) => {
    try {
      const response = await getTeamGroupList({ teamId });
      setTeamGroups(response.data.results);
    } catch (error) {
      toaster.error({
        title: "그룹 불러오기 실패",
        description: "그룹을 불러오는 데 실패했습니다",
      });
    }
  };

  const memberList = useMemo(() => {
    return createListCollection({
      items: teamMembers || [],
      itemToString: (item: TeamMemberDTO) => item.member.name,
      itemToValue: (item: TeamMemberDTO) => item.id,
    });
  }, [teamMembers]);

  const groupedMembers = useMemo(() => {
    const groupMap = teamGroups.reduce(
      (acc: { [key: string]: TeamMemberDTO[] }, group) => {
        acc[group.name] = [];
        return acc;
      },
      {}
    );

    teamMembers.forEach((member) => {
      member.team_groups.forEach((group) => {
        if (groupMap[group.team_group.name]) {
          groupMap[group.team_group.name].push(member);
        } else {
          groupMap[group.team_group.name] = [member];
        }
      });
    });

    return groupMap;
  }, [teamMembers, teamGroups]);

  const handleSelectChange = (selected: MemberDTO[]) => {
    setSelectedMembers(selected);
  };

  const options = useMemo(() => {
    const groupOptions = Object.keys(groupedMembers).map((groupName) => ({
      label: groupName,
      options: groupedMembers[groupName].map((member) => ({
        label: member.member.name,
        value: member.member,
      })),
    }));

    return groupOptions;
  }, [groupedMembers]);

  return (
    <Select
      isMulti
      value={selectedMembers.map((member) => ({
        label: teamMembers.find(
          (teamMember) => teamMember.member.id === member.id
        )?.member.name,
        value: member,
      }))}
      closeMenuOnSelect={false}
      hideSelectedOptions={true}
      options={options}
      tagVariant="ghost"
      placeholder=""
      noOptionsMessage={() => <EmptyStateValue />}
      onChange={(selectedOptions) =>
        handleSelectChange(selectedOptions.map((option: any) => option.value))
      }
      components={{
        Group: TeamMemberGroup,
        GroupHeading: TeamMemberGroupHeading,
        Option: MemberItem,
        MultiValue: SelectedMemberValue,
      }}
    />
  );
};

export default MemberSelectorWithGroup;
