"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Avatar } from "../../ui/avatar";
import {
  Button,
  Card,
  Field,
  Fieldset,
  Select,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { LuUserRound, LuPlus, LuUserRoundPlus, LuMinus } from "react-icons/lu";
import { createListCollection } from "@chakra-ui/react";
import {
  ProjectMemberDTO,
  TaskAssignmentDTO,
  TaskAssignmentInfoDTO,
} from "@/lib/interface/fetchDTOs";
import {
  fetchProjectMembersAll,
  fetchTaskAssignmentsByTaskId,
} from "@/lib/api/fetchApi";
import { toaster } from "../../ui/toaster";
import { useParams } from "next/navigation";
import { TaskAssignmentForm } from "@/lib/interface/form";
import { get } from "lodash";

const TaskAssignDialog = ({ taskId }: { taskId: string }) => {
  //   const params = useParams();
  //   const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const projectId = "1";
  const [assignedMembers, setAssignedMembers] = useState<TaskAssignmentDTO[]>(
    []
  );
  const [members, setMembers] = useState<TaskAssignmentForm[]>([]);
  const [projectMembers, setProjectMembers] = useState<ProjectMemberDTO[]>([]);

  useEffect(() => {
    getTaskAssignments({ taskId });
    getProjectMembers({ project: projectId! });
  }, [projectId]);

  const getTaskAssignments = async ({ taskId }: { taskId: string }) => {
    try {
      const response = await fetchTaskAssignmentsByTaskId(taskId);
      setAssignedMembers(response.data);
    } catch (error) {
      toaster.error({
        title: "멤버 불러오기 실패",
        description: "멤버를 불러오는 데 실패했습니다",
      });
    }
  };

  const getProjectMembers = async ({ project }: { project: string }) => {
    try {
      const response = await fetchProjectMembersAll(project);
      setProjectMembers(response.data.results);
    } catch (error) {
      toaster.error({
        title: "멤버 불러오기 실패",
        description: "멤버를 불러오는 데 실패했습니다",
      });
    }
  };

  const addMemberField = () => {
    setMembers([
      ...members,
      {
        member: "",
      },
    ]);
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { member: value };
    setMembers(newMembers);
  };

  const removeMemberField = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const memberList = useMemo(() => {
    return createListCollection({
      items: projectMembers || [],
      itemToString: (item: ProjectMemberDTO) => item.member.name,
      itemToValue: (item: ProjectMemberDTO) => item.member.id,
    });
  }, [projectMembers]);

  const assignedMemberList = useMemo(() => {
    return createListCollection({
      items: assignedMembers || [],
      itemToString: (item: TaskAssignmentDTO) => item.member.name,
      itemToValue: (item: TaskAssignmentDTO) => item.id,
    });
  }, [assignedMembers]);

  return (
    <Card.Root>
      <Card.Body>
        <Stack gap={4}>
          {assignedMemberList.map((member, index) => (
            <Stack direction="row" alignItems="center" key={member.value}>
              <SelectRoot
                size="sm"
                width="320px"
                padding="12px"
                name="members"
                value={}
                collection={assignedMemberList}
                onValueChange={(selectedItem) => {
                  handleMemberChange(index, selectedItem.value[0]);
                }}
              >
                <SelectTrigger>
                  <SelectValueText />
                </SelectTrigger>
                <SelectContent portalled={false}>
                  {memberList.items.map((projectMember) => (
                    <SelectItem
                      item={projectMember}
                      key={projectMember.id}
                      justifyContent="flex-start"
                    >
                      <Avatar
                        shape="rounded"
                        name={projectMember.member.name}
                        size="2xs"
                      />
                      {projectMember.member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              <IconButton
                aria-label="remove-member"
                onClick={() => removeMemberField(index)}
                size="2xs"
                variant="ghost"
              >
                <LuMinus />
              </IconButton>
            </Stack>
          ))}

          {members.map((member, index) => (
            <Field.Root key={index} orientation="horizontal">
              <Field.Label marginRight="0">
                <LuUserRound />
              </Field.Label>
              <Stack direction="row" alignItems="center">
                <SelectRoot
                  size="sm"
                  width="320px"
                  padding="12px"
                  name="members"
                  value={[members[index].member]}
                  collection={memberList}
                  onValueChange={(selectedItem) => {
                    handleMemberChange(index, selectedItem.value[0]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText />
                  </SelectTrigger>
                  <SelectContent portalled={false}>
                    {memberList.items.map((projectMember) => (
                      <SelectItem
                        item={projectMember}
                        key={projectMember.id}
                        justifyContent="flex-start"
                      >
                        <Avatar
                          shape="rounded"
                          name={projectMember.member.name}
                          size="2xs"
                        />
                        {projectMember.member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
                <IconButton
                  aria-label="remove-member"
                  onClick={() => removeMemberField(index)}
                  size="2xs"
                  variant="ghost"
                >
                  <LuMinus />
                </IconButton>
              </Stack>
            </Field.Root>
          ))}
          <IconButton aria-label="add-member" onClick={addMemberField}>
            <LuUserRoundPlus />
          </IconButton>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

export default TaskAssignDialog;
