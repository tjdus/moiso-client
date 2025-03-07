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
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Avatar } from "../ui/avatar";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { createProject } from "@/lib/api/postApi";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { CategoryInput, ProjectInput } from "@/lib/api/interface/requestDTO";

import { CategoryNameDTO, TeamMemberDTO } from "@/lib/api/interface/fetchDTOs";
import { createListCollection } from "@chakra-ui/react";
import { createCategory as createCategory } from "@/lib/api/postApi";
import { StatusTag, TagItem } from "../custom-ui/Tag";
import { Status } from "@/lib/api/interface/common";
import { Radio, RadioGroup } from "../ui/radio";
import { SingleDatepicker } from "../date-picker/DayzedDatepicker";
import { fetchCategoryList, fetchTeamMemberList } from "@/lib/api/fetchApi";

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

const SelectCategoryItem = () => (
  <SelectValueText placeholder="카테고리를 선택하세요">
    {(items: Array<{ id: string; name: string }>) => {
      const { id, name } = items[0];
      return <TagItem id={id} name={name} size="md" />;
    }}
  </SelectValueText>
);

const ProjectCreationForm = () => {
  const [project, setProject] = useState<ProjectInput>({});
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMemberDTO[]>([]);
  const [categories, setCategories] = useState<CategoryNameDTO[]>([]);
  const [status, setStatus] = useState<string>("not_started");
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [start_date, setStartDate] = useState<Date | null>(null);
  const [end_date, setEndDate] = useState<Date | null>(null);
  const teamId = "1";

  useEffect(() => {
    setProject((prev) => ({ ...prev, team: teamId }));
    getTeamMembers({ teamId });
    getCategories({ teamId });
  }, [teamId]);

  const handleCreateProject = async () => {
    const response = createProject(project);
    toaster.promise(response, {
      success: {
        title: "프로젝트 생성 성공",
        description: "새로운 프로젝트가 생성되었습니다",
      },
      error: {
        title: "프로젝트 생성 실패",
        description: "프로젝트 생성에 실패했습니다",
      },
      loading: {
        title: "프로젝트 생성 중",
        description: "잠시만 기다려주세요...",
      },
    });
  };

  const getTeamMembers = async ({ teamId }: { teamId: string }) => {
    try {
      const response = await fetchTeamMemberList({ teamId });
      setTeamMembers(response.data.results);
    } catch (error) {
      toaster.error({
        title: "멤버 불러오기 실패",
        description: "팀 멤버를 불러오는 데 실패했습니다",
      });
    }
  };

  const getCategories = async ({ teamId }: { teamId: string }) => {
    try {
      const response = await fetchCategoryList({ teamId });
      setCategories(response.data.results);
    } catch (error) {
      toaster.error({
        title: "카테고리 불러오기 실패",
        description: "카테고리를 불러오는 데 실패했습니다",
      });
    }
  };

  const createNewCategory = async ({ name }: { name: string }) => {
    try {
      const requestData: CategoryInput = {
        team: teamId,
        name: name,
      };
      const response = await createCategory(requestData);

      if (response.status === 201) {
        setNewCategoryName("");
        const newCategory: CategoryNameDTO = {
          id: response.data.id || "",
          name: response.data.name || "",
        };
        setCategories((prevCategories) => [...prevCategories, newCategory]);
      }
    } catch (error) {
      toaster.error({
        title: "카테고리 생성 실패",
        description: "카테고리를 생성하는 데 실패했습니다",
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

  const categoryList = useMemo(() => {
    return createListCollection({
      items: categories || [],
      itemToString: (item: CategoryNameDTO) => item.name,
      itemToValue: (item: CategoryNameDTO) => item.id,
    });
  }, [categories]);

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
                placeholder="팀 이름을 입력해주세요"
                onChange={(e) => {
                  setName(e.target.value);
                  setProject((prevDetails) => ({
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
                  setProject((prevDetails) => ({
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
                value={project.members}
                collection={memberList}
                onValueChange={(selectedItems) => {
                  setProject((prevDetails) => ({
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
            <Field label="카테고리">
              <SelectRoot
                size="sm"
                width="320px"
                padding="12px"
                name="category"
                value={[project.category || ""]}
                collection={categoryList}
                onValueChange={(selectedItem) => {
                  setProject((prevDetails) => ({
                    ...prevDetails,
                    category: selectedItem.items[0]?.id || "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectCategoryItem />
                </SelectTrigger>
                <SelectContent portalled={false}>
                  {categoryList.items.map((categoryItem) => (
                    <SelectItem
                      item={categoryItem}
                      key={categoryItem.id}
                      justifyContent="flex-start"
                      padding={1}
                    >
                      <TagItem
                        id={categoryItem.id}
                        name={categoryItem.name}
                        size="sm"
                      />
                    </SelectItem>
                  ))}
                  <HStack padding="12px">
                    <Input
                      padding="12px"
                      placeholder="새 카테고리 이름"
                      value={newCategoryName || ""}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        createNewCategory({ name: newCategoryName })
                      }
                    >
                      +
                    </Button>
                  </HStack>
                </SelectContent>
              </SelectRoot>
            </Field>
            <Field label="상태">
              <RadioGroup
                value={status}
                onValueChange={(e) => {
                  setStatus(e.value);
                  setProject((prevDetails) => ({
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
                  setProject((prevDetails) => ({
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
                  setProject((prevDetails) => ({
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
              onClick={handleCreateProject}
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

export default ProjectCreationForm;
