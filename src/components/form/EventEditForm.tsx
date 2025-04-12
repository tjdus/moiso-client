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
import { updateEvent } from "@/lib/api/patchApi";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { EventInput } from "@/lib/api/interface/requestDTO";
import { Radio, RadioGroup } from "../ui/radio";
import { TagItem } from "../custom-ui/Tag";

import { TeamMemberDTO } from "@/lib/api/interface/fetchDTOs";
import { createListCollection } from "@chakra-ui/react";
import { SingleDatepicker } from "../date-picker/DayzedDatepicker";
import { getTeamMemberList, getEventDetail } from "@/lib/api/getApi";

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

const EventEditForm = ({ teamId } : { teamId: string }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMemberDTO[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const [start_at, setStartAt] = useState<Date | null>(null);
  const [end_at, setEndAt] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("public");

  useEffect(() => {
    getTeamMembers({ teamId });
  }, [teamId]);

  useEffect(() => {
    const getEvent = async () => {
      const response = await getEventDetail(teamId);
      const event = response.data;
      setTitle(event.title);
      setDescription(event.description);
      setMembers(event.members.map((member) => member.id));
      setLocation(event.location);
      setStartAt(new Date(event.start_at));
      setEndAt(new Date(event.end_at));
      setStatus(event.is_private ? "private" : "public");
    };

    getEvent();
  }, [teamId]);

  const handleUpdateEvent = async () => {
    const event: EventInput = {
      members,
      title,
      description,
      start_at: start_at?.toISOString(),
      end_at: end_at?.toISOString(),
      location,
      is_private: status === "private" ? true : false,
    };
    const response = updateEvent(teamId, event);
    toaster.promise(response, {
      success: {
        title: "일정 수정 성공",
        description: "일정이 수정되었습니다",
      },
      error: {
        title: "일정 수정 실패",
        description: "일정 수정에 실패했습니다",
      },
      loading: {
        title: "일정 수정 중",
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
        description: " 멤버를 불러오는 데 실패했습니다",
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
    <Fieldset.Root padding="5">
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
                name="title"
                value={title}
                placeholder="제목을 입력해주세요"
                onChange={(e) => {
                  setTitle(e.target.value);
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
                value={members}
                collection={memberList}
                onValueChange={(selectedItems) => {
                  setMembers(selectedItems.items.map((item) => item.member.id));
                }}
              >
                <SelectTrigger>
                  <SelectMemberItem />
                </SelectTrigger>
                <SelectContent portalled={true}>
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
            <Field label="장소">
              <Textarea
                padding="12px"
                name="location"
                value={location}
                placeholder="장소를 입력해주세요"
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </Field>
            <Field label="상태">
              <RadioGroup
                value={status}
                onValueChange={(e) => {
                  setStatus(e.value);
                }}
              >
                <HStack gap={2}>
                  <Radio value="public" colorPalette="blue">
                    <TagItem id="6" size="md" name="공개" />
                  </Radio>
                  <Radio value="private" colorPalette="grey">
                    <TagItem id="0" size="md" name="비공개" />
                  </Radio>
                </HStack>
              </RadioGroup>
            </Field>
            <Field label="시작 날짜">
              <SingleDatepicker
                date={start_at || new Date()}
                onDateChange={(date) => {
                  setStartAt(date);
                }}
              />
            </Field>
            <Field label="종료 날짜">
              <SingleDatepicker
                date={end_at || new Date()}
                onDateChange={(date) => {
                  setEndAt(date);
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
              onClick={handleUpdateEvent}
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

export default EventEditForm;