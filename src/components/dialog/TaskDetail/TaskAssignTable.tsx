"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
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
  TableRoot,
  TableHeader,
  TableBody,
  TableColumnHeader,
  TableRow,
  TableCell,
  HStack,
} from "@chakra-ui/react";
import { Radio, RadioGroup } from "../../ui/radio";
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
import { StatusTag } from "../../custom-ui/Tag";
import { formatToKST } from "@/lib/util/dateFormat";
import { LuUserRoundMinus } from "react-icons/lu";
import { deleteTaskAssignment } from "@/lib/api/deleteApi";
import { createTaskAssignment } from "@/lib/api/postApi";
import CreationDialog from "../CreationDialog";

const headers = ["담당자", "진행 상태", "할당일", "완료일", "-"];

interface WarnDialogProps {
  trigger: React.ReactNode;
  confirmRemove: () => void;
}

const WarnDialog = ({ trigger, confirmRemove }: WarnDialogProps) => {
  return (
    <DialogRoot role="alertdialog" placement="top" size="sm">
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent mt={20} padding={10}>
        <DialogBody>삭제하시겠습니까?</DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button colorPalette="red" onClick={confirmRemove}>
              삭제
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

const TaskAssignmetCreateDialog = ({
  addTaskAssignment,
}: {
  addTaskAssignment: (taskAssignment: TaskAssignmentForm) => void;
}) => {
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [member, setMember] = useState<string>("");
  const [status, setStatus] = useState<string>("not_started");
  const [projectMembers, setProjectMembers] = useState<ProjectMemberDTO[]>([]);

  useEffect(() => {
    getProjectMembers({ project: projectId! });
  }, [projectId]);

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

  const memberList = useMemo(() => {
    return createListCollection({
      items: projectMembers || [],
      itemToString: (item: ProjectMemberDTO) => item.member.name,
      itemToValue: (item: ProjectMemberDTO) => item.member.id,
    });
  }, [projectMembers]);

  return (
    <DialogRoot placement="top" size="sm">
      <DialogTrigger asChild>
        <IconButton size="md" variant="outline">
          <LuUserRoundPlus />
        </IconButton>
      </DialogTrigger>
      <DialogContent mt={20} padding={10}>
        <DialogBody>
          <Field.Root orientation="horizontal">
            <Field.Label>
              <LuUserRound />
            </Field.Label>
            <SelectRoot
              size="sm"
              width="320px"
              padding="12px"
              name="members"
              value={[member]}
              collection={memberList}
              onValueChange={(selectedItem) => setMember(selectedItem.value[0])}
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
          </Field.Root>
          <Field.Root>
            <Field.Label>진행 상태</Field.Label>

            <RadioGroup
              value={status}
              onValueChange={(e) => {
                setStatus(e.value);
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
          </Field.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button
              colorPalette="blue"
              onClick={() =>
                addTaskAssignment({
                  member: member,
                  status: status,
                })
              }
            >
              추가
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

const TaskAssignTable = ({ taskId }: { taskId: string }) => {
  //   const params = useParams();
  //   const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const projectId = "1";
  const [assignedMembers, setAssignedMembers] = useState<TaskAssignmentDTO[]>(
    []
  );
  const [members, setMembers] = useState<TaskAssignmentForm[]>([]);

  useEffect(() => {
    getTaskAssignments({ taskId });
  }, [taskId]);

  const getTaskAssignments = async ({ taskId }: { taskId: string }) => {
    try {
      const response = await fetchTaskAssignmentsByTaskId(taskId);
      setAssignedMembers(response.data.results);
    } catch (error) {
      toaster.error({
        title: "멤버 불러오기 실패",
        description: "멤버를 불러오는 데 실패했습니다",
      });
    }
  };

  const removeTaskAssignment = async (id: string, taskId: string) => {
    try {
      await deleteTaskAssignment({ assignmentId: id });
      getTaskAssignments({ taskId });
    } catch (error) {
      toaster.error({
        title: "삭제 실패",
        description: "작업 할당을 삭제하는 데 실패했습니다",
      });
    }
  };
  const addTaskAssignment = async ({ member, status }: TaskAssignmentForm) => {
    try {
      const taskAssignment = { task: taskId, member, status };
      const response = await createTaskAssignment(taskAssignment);
      getTaskAssignments({ taskId });
    } catch (error: any) {
      if (error.non_field_errors) {
        toaster.create({
          title: "경고",
          description: "이미 할당된 멤버입니다",
          type: "warning",
        });
      } else {
        toaster.error({
          title: "실패",
          description: "작업 할당 생성 중 오류가 발생했습니다",
        });
      }
    }
  };

  return (
    <Stack>
      <TableRoot size="lg" borderRadius="md" border="1px">
        <TableHeader fontSize="sm" textAlign="center">
          <TableRow>
            {headers.map((header, index) => (
              <TableColumnHeader
                key={index}
                padding={4}
                borderBottom="2px"
                textAlign="center"
              >
                {header}
              </TableColumnHeader>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignedMembers.length > 0 &&
            assignedMembers.map((assignment, index) => (
              <TableRow
                key={assignment.id}
                cursor="pointer"
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <TableCell padding={4} align="center">
                  <Avatar
                    shape="rounded"
                    name={assignment.member.name}
                    size="2xs"
                  />
                  {assignment.member.name}
                </TableCell>

                <TableCell padding={4} align="center">
                  <StatusTag status={assignment.status} size="md" />
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {formatToKST({ dateString: assignment.assigned_at })}
                </TableCell>
                <TableCell padding={4} textAlign="center" fontSize="xs">
                  {assignment.completed_at
                    ? formatToKST({ dateString: assignment.completed_at })
                    : "-"}
                </TableCell>

                <TableCell padding={4} align="center">
                  <WarnDialog
                    trigger={
                      <IconButton
                        aria-label="remove-member"
                        size="sm"
                        variant="ghost"
                        colorPalette="red"
                      >
                        <LuUserRoundMinus />
                      </IconButton>
                    }
                    confirmRemove={() =>
                      removeTaskAssignment(assignment.id, taskId)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </TableRoot>
      <TaskAssignmetCreateDialog addTaskAssignment={addTaskAssignment} />
    </Stack>
  );
};

export default TaskAssignTable;
