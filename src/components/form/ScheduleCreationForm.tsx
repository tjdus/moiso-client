"use client";

import { useEffect, useMemo } from "react";
import {
  Button,
  Input,
  Fieldset,
  Stack,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Avatar } from "../ui/avatar";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { createSchedule } from "@/lib/api/postApi";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { ScheduleInput } from "@/lib/api/interface/requestDTO";

import { TeamMemberDTO } from "@/lib/api/interface/fetchDTOs";
import { createListCollection } from "@chakra-ui/react";
import { SingleDatepicker } from "../date-picker/DayzedDatepicker";
import { getTeamMemberList } from "@/lib/api/getApi";
import { Status } from "@/lib/api/interface/common";
import { Radio, RadioGroup } from "../ui/radio";
import { StatusTag } from "../custom-ui/Tag";

const SelectMemberItem = () => (
  <SelectValueText placeholder="멤버를 선택하세요">
    {(items: Array<{ id: string; name: string }>) => (
      <HStack>
        {items.map(({ id, name }) => (
          <HStack key={id}>
            <Avatar shape="rounded" name={name} size="xs" />
          </HStack>
        ))}
      </HStack>
    )}
  </SelectValueText>
);

const ScheduleCreationForm = () => {
  const [schedule, setSchedule] = useState<ScheduleInput>({});
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMemberDTO[]>([]);
  const [status, setStatus] = useState<string>("not_started");
  const [place, setPlace] = useState<string>("");
  const [start_date, setStartDate] = useState<Date | null>(null);
  const [end_date, setEndDate] = useState<Date | null>(null);
  const teamId = "1";

  useEffect(() => {
    setSchedule((prev) => ({ ...prev, team: teamId }));
    getTeamMembers({ teamId });
  }, [teamId]);

  const handleCreateSchedule = async () => {
    if (!name || !description || !start_date || !end_date) {
      toaster.error({
        title: "일정 생성 실패",
        description: "필수 항목을 모두 입력해주세요",
      });
      return;
    }
    
    const response = createSchedule(schedule);
    toaster.promise(response, {
      success: {
        title: "일정 생성 성공",
        description: "새로운 일정이 생성되었습니다",
      },
      error: {
        title: "일정 생성 실패",
        description: "일정 생성에 실패했습니다",
      },
      loading: {
        title: "일정 생성 중",
        description: "잠시만 기다려주세요...",
      },
    });
  };

  const getTeamMembers = async ({ teamId }: { teamId: string }) => {
    try {
      const response = await getTeamMemberList({ teamId });
      setTeamMembers(response.data.results);
    } catch (error) {
      toaster.error({
        title: "멤버 불러오기 실패",
        description: "팀 멤버를 불러오는 데 실패했습니다",
      });
    }
  };

  const memberList = useMemo(() => {
    return createListCollection({
      items: teamMembers || [],
      itemToString: (item: TeamMemberDTO) => item.member.name,
      itemToValue: (item: TeamMemberDTO) => item.member.id,
    });
  }, [teamMembers]);

  return (
    <Fieldset.Root>
      <DialogHeader>프로젝트 만들기</DialogHeader>
      <DialogBody>
        <Fieldset.Content>
          <Stack
            flexDir="column"
            mb="2"
            justifyContent="center"
            alignItems="center"
          >
            <Field label="이름">
              <Input
                padding="12px"
                name="name"
                value={name}
                placeholder="제목을 입력해주세요"
                onChange={(e) => {
                  setName(e.target.value);
                  setSchedule((prevDetails) => ({
                    ...prevDetails,
                    name: e.target.value,
                  }));
                }}
              />
            </Field>
            <Field label="설명">
              <Textarea
                padding="12px"
                name="description"
                value={description}
                placeholder="설명을 입력해주세요"
                onChange={(e) => {
                  setDescription(e.target.value);
                  setSchedule((prevDetails) => ({
                    ...prevDetails,
                    description: e.target.value,
                  }));
                }}
              />
            </Field>
            <Field label="멤버">
              <SelectRoot
                multiple
                size="sm"
                width="320px"
                padding="12px"
                name="members"
                value={schedule.members}
                collection={memberList}
                onValueChange={(selectedItems) => {
                  setSchedule((prevDetails) => ({
                    ...prevDetails,
                    members: selectedItems.items.map((item) => item.member.id),
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectMemberItem />
                </SelectTrigger>
                <SelectContent portalled={false}>
                  {memberList.items.map((teamMember) => (
                    <SelectItem
                      item={teamMember}
                      key={teamMember.id}
                      justifyContent="flex-start"
                    >
                      <Avatar
                        shape="rounded"
                        name={teamMember.member.name}
                        size="2xs"
                      />
                      {teamMember.member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Field>
            <Field label="상태">
              <RadioGroup
                value={status}
                onValueChange={(e) => {
                  setStatus(e.value);
                  setSchedule((prevDetails) => ({
                    ...prevDetails,
                    status: e.value as Status,
                  }));
                }}
              >
                <HStack gap={2}>
                  <Radio value="not_started">
                    <StatusTag status="not_started" size="md" />
                  </Radio>
                  <Radio value="in_progress">
                    <StatusTag status="in_progress" size="md" />
                  </Radio>
                  <Radio value="completed">
                    <StatusTag status="completed" size="md" />
                  </Radio>
                </HStack>
              </RadioGroup>
            </Field>
            <Field label="장소">
              <Textarea
                padding="12px"
                name="place"
                value={place}
                placeholder="장소를 입력해주세요"
                onChange={(e) => {
                  setPlace(e.target.value);
                  setSchedule((prevDetails) => ({
                    ...prevDetails,
                    place: e.target.value,
                  }));
                }}
              />
            </Field>
            <Field label="시작 날짜">
              <SingleDatepicker
                date={start_date || new Date()}
                onDateChange={(date) => {
                  setStartDate(date);
                  setSchedule((prevDetails) => ({
                    ...prevDetails,
                    start_date: date.toISOString().split("T")[0],
                  }));
                }}
              />
            </Field>
            <Field label="종료 날짜">
              <SingleDatepicker
                date={end_date || new Date()}
                onDateChange={(date) => {
                  setEndDate(date);
                  setSchedule((prevDetails) => ({
                    ...prevDetails,
                    end_date: date.toISOString().split("T")[0], // Removed redundant '|| ""'
                  }));
                }}
              />
            </Field>
          </Stack>
        </Fieldset.Content>
      </DialogBody>
      <DialogFooter>
        <DialogCloseTrigger />
        <HStack gap={2}>
          <DialogActionTrigger asChild>
            <Button variant="outline">취소</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button
              type="submit"
              onClick={handleCreateSchedule}
              colorScheme="blue"
              px={4}
            >
              만들기
            </Button>
          </DialogActionTrigger>
        </HStack>
      </DialogFooter>
    </Fieldset.Root>
  );
};

export default ScheduleCreationForm;
