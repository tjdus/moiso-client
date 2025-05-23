"use client";

import { useEffect, useMemo } from "react";
import {
  Button,
  Input,
  Fieldset,
  Stack,
  HStack,
  Textarea, 
  createListCollection,
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
import { createEvent } from "@/lib/api/postApi";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { EventInput } from "@/lib/api/interface/requestDTO";

import { TeamMemberDTO } from "@/lib/api/interface/fetchDTOs";
import { SingleDatepicker } from "../date-picker/DayzedDatepicker";
import { getTeamMemberList } from "@/lib/api/getApi";
import { Radio, RadioGroup } from "../ui/radio";
import { TagItem } from "../custom-ui/Tag";

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

const EventCreationForm = ({ teamId } : { teamId: string }) => {
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

  const handleCreateEvent = async () => {
    const event: EventInput = {
      team: teamId,
      members,
      title,
      description,
      start_at: start_at?.toISOString(),
      end_at: end_at?.toISOString(),
      location,
      is_private: status === 'private' ? true : false,
    };
    const response = createEvent(event);
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
    <Fieldset.Root>
      <DialogHeader>일정 만들기</DialogHeader>
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
              onClick={handleCreateEvent}
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

export default EventCreationForm;
