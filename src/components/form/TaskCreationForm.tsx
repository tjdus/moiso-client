"use client";

import { useEffect, useMemo } from "react";
import {
  Button,
  Input,
  Fieldset,
  Stack,
  HStack,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Avatar } from "../ui/avatar";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { createProject, createTag, createTask } from "@/lib/api/postApi";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TagForm, TaskForm } from "@/lib/interface/form";
import { fetchProjectMembers, fetchTagsByProjectId } from "@/lib/api/fetchApi";
import { ProjectMemberDTO, TagDTO } from "@/lib/interface/fetchDTOs";
import { createListCollection } from "@chakra-ui/react";
import { StatusTag, TagItem } from "../custom-ui/Tag";
import { Status } from "@/lib/interface/common";
import { Radio, RadioGroup } from "../ui/radio";
import { SingleDatepicker } from "../date-picker/DayzedDatepicker";
import { LuPlus } from "react-icons/lu";

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

const SelectTagItem = () => (
  <SelectValueText placeholder="태그를 선택하세요">
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

const TaskCreationForm = () => {
  const [task, setTask] = useState<TaskForm>({});
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [projectMembers, setProjectMembers] = useState<ProjectMemberDTO[]>([]);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [status, setStatus] = useState<string>("not_started");
  const [newTagName, setNewTagName] = useState<string>("");
  const [start_date, setStartDate] = useState<Date | null>(null);
  const [end_date, setEndDate] = useState<Date | null>(null);
  const teamId = "1";
  const projectId = "1";

  useEffect(() => {
    setTask((prev) => ({ ...prev, team: teamId }));
    getProjectMembers({ project: projectId });
    getTags({ projectId });
  }, [teamId]);

  const handleCreateTask = async () => {
    const response = createTask(task);
    toaster.promise(response, {
      success: {
        title: "업부 생성 성공",
        description: "새로운 업무가 생성되었습니다",
      },
      error: {
        title: "업무 생성 실패",
        description: "업무 생성에 실패했습니다",
      },
      loading: {
        title: "업무 생성 중",
        description: "잠시만 기다려주세요...",
      },
    });
  };

  const getProjectMembers = async ({ project }: { project: string }) => {
    try {
      const response = await fetchProjectMembers(project);
      setProjectMembers(response.data.results);
    } catch (error) {
      toaster.error({
        title: "멤버 불러오기 실패",
        description: "멤버를 불러오는 데 실패했습니다",
      });
    }
  };

  const getTags = async ({ projectId }: { projectId: string }) => {
    try {
      const response = await fetchTagsByProjectId(projectId);
      setTags(response.data.results);
    } catch (error) {
      toaster.error({
        title: "태그 불러오기 실패",
        description: "태그를 불러오는 데 실패했습니다",
      });
    }
  };

  const createNewTag = async ({ name }: { name: string }) => {
    try {
      const requestData: TagForm = {
        project: projectId,
        name: name,
      };
      const response = await createTag(requestData);

      if (response.status === 201) {
        setNewTagName("");
        const newTag: TagDTO = {
          id: response.data.id || "",
          name: response.data.name || "",
        };
        setTags((prevTags) => [...prevTags, newTag]);
      }
    } catch (error) {
      toaster.error({
        title: "태그 생성 실패",
        description: "태그를 생성하는 데 실패했습니다",
      });
    }
  };

  const memberList = useMemo(() => {
    return createListCollection({
      items: projectMembers || [],
      itemToString: (item: ProjectMemberDTO) => item.member.name,
      itemToValue: (item: ProjectMemberDTO) => item.member.id,
    });
  }, [projectMembers]);

  const tagList = useMemo(() => {
    return createListCollection({
      items: tags || [],
      itemToString: (item: TagDTO) => item.name,
      itemToValue: (item: TagDTO) => item.id,
    });
  }, [tags]);

  return (
    <Fieldset.Root>
      <DialogHeader>업무 만들기</DialogHeader>
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
                value={title}
                placeholder="제목을 입력해주세요"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTask((prevDetails) => ({
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
                  setTask((prevDetails) => ({
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
                value={task.members}
                collection={memberList}
                onValueChange={(selectedItems) => {
                  setTask((prevDetails) => ({
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
            <Field label="태그">
              <SelectRoot
                multiple
                size="sm"
                width="320px"
                padding="12px"
                name="category"
                value={task.tags}
                collection={tagList}
                onValueChange={(selectedItem) => {
                  setTask((prevDetails) => ({
                    ...prevDetails,
                    tags: selectedItem.items.map((item) => item.id),
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectTagItem />
                </SelectTrigger>
                <SelectContent portalled={false}>
                  {tagList.items.map((tagItem) => (
                    <SelectItem
                      item={tagItem}
                      key={tagItem.id}
                      justifyContent="flex-start"
                      padding={1}
                    >
                      <TagItem id={tagItem.id} name={tagItem.name} size="sm" />
                    </SelectItem>
                  ))}

                  <PopoverRoot>
                    <PopoverTrigger asChild>
                      <IconButton size="xs">
                        <LuPlus />
                      </IconButton>
                    </PopoverTrigger>
                    <PopoverContent portalled={false}>
                      <HStack padding="12px">
                        <Input
                          padding="12px"
                          placeholder="새 태그 이름"
                          value={newTagName || ""}
                          onChange={(e) => setNewTagName(e.target.value)}
                        />
                        <IconButton
                          size="xs"
                          onClick={() => createNewTag({ name: newTagName })}
                        >
                          <LuPlus />
                        </IconButton>
                      </HStack>
                    </PopoverContent>
                  </PopoverRoot>
                </SelectContent>
              </SelectRoot>
            </Field>
            <Field label="상태">
              <RadioGroup
                value={status}
                onValueChange={(e) => {
                  setStatus(e.value);
                  setTask((prevDetails) => ({
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
            <Field label="시작 날짜">
              <SingleDatepicker
                date={start_date || new Date()}
                onDateChange={(date) => {
                  setStartDate(date);
                  setTask((prevDetails) => ({
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
                  setTask((prevDetails) => ({
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
              onClick={handleCreateTask}
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

export default TaskCreationForm;
