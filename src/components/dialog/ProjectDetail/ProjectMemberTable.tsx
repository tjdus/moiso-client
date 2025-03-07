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
  TeamMemberDTO,
} from "@/lib/api/interface/fetchDTOs";

import { toaster } from "../../ui/toaster";
import { useParams } from "next/navigation";
import {
  ProjectMemberInput,
  TaskAssignmentInput,
} from "@/lib/api/interface/requestDTO";
import { StatusTag } from "../../custom-ui/Tag";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import { LuUserRoundMinus } from "react-icons/lu";
import { deleteProjectMember, deleteTaskAssignment } from "@/lib/api/deleteApi";
import { createProjectMember, createTaskAssignment } from "@/lib/api/postApi";
import CreationDialog from "../CreationDialog";
import {
  fetchProjectMemberList,
  fetchTaskAssignmentList,
  fetchTeamMemberDetail,
  fetchTeamMemberList,
} from "@/lib/api/fetchApi";
import { useRole } from "@/lib/context/RoleContext";
import { WarnDialog } from "@/components/custom-ui/SaveDeleteButton";
import { RoleBadge } from "@/components/custom-ui/RoleBadge";
import { TeamGroupTag } from "@/components/custom-ui/TeamGroup";
import { RoleRadioCard } from "@/components/custom-ui/RoleSelector";
import { useTeam } from "@/lib/context/TeamProvider";

const headers = ["이름", "이메일", "역할", "권한", "-"];

const AddProjectMemberDialog = ({
  projectId,
  addProjectMember: addProjectMember,
}: {
  projectId: string;
  addProjectMember: (data: ProjectMemberInput) => void;
}) => {
  const { team: teamId } = useTeam();
  const [member, setMember] = useState<string>("");
  const [role, setRole] = useState<string>("viewer");
  const [teamMembers, setTeamMembers] = useState<TeamMemberDTO[]>([]);

  if (!teamId) {
    return null;
  }

  useEffect(() => {
    getTeamMembers();
  }, []);

  const getTeamMembers = async () => {
    try {
      const response = await fetchTeamMemberList({ teamId });
      setTeamMembers(response.data.results);
    } catch (error) {
      toaster.error({
        title: "멤버 불러오기 실패",
        description: "멤버를 불러오는 데 실패했습니다",
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

  const resetForm = () => {
    setMember("");
    setRole("not_started");
  };

  return (
    <DialogRoot placement="top" size="sm">
      <DialogTrigger asChild>
        <IconButton size="md" variant="outline">
          <LuUserRoundPlus />
        </IconButton>
      </DialogTrigger>
      <DialogContent mt={40}>
        <DialogBody>
          <Card.Root padding={10}>
            <Card.Body>
              <Field.Root orientation="horizontal">
                <Field.Label>
                  <LuUserRound />
                  멤버
                </Field.Label>
                <SelectRoot
                  size="sm"
                  width="320px"
                  padding="12px"
                  name="members"
                  value={[member]}
                  collection={memberList}
                  onValueChange={(selectedItem) =>
                    setMember(selectedItem.value[0])
                  }
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
                <Field.Label>권한</Field.Label>

                <RoleRadioCard value={role} onValueChange={setRole} />
              </Field.Root>
            </Card.Body>
          </Card.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button
              colorPalette="blue"
              onClick={() => {
                addProjectMember({
                  member: member,
                  role: role,
                });
                resetForm();
              }}
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

const ProjectMember = ({ projectId }: { projectId: string }) => {
  const { role } = useRole();
  const { team: teamId } = useTeam();
  const [projectMemberList, setProjectMemberList] = useState<
    ProjectMemberDTO[]
  >([]);
  const [members, setMembers] = useState<TaskAssignmentInput[]>([]);

  useEffect(() => {
    getProjectMembers({ projectId });
  }, [projectId]);

  const getProjectMembers = async ({ projectId }: { projectId: string }) => {
    try {
      const response = await fetchProjectMemberList({ projectId });
      setProjectMemberList(response.data.results);
    } catch (error) {
      toaster.error({
        title: "멤버 불러오기 실패",
        description: "멤버를 불러오는 데 실패했습니다",
      });
    }
  };

  const removeProjectMember = async (id: string, projectId: string) => {
    try {
      await deleteProjectMember(id);
      getProjectMembers({ projectId });
    } catch (error) {
      toaster.error({
        title: "삭제 실패",
      });
    }
  };
  const addProjectMember = async (data: ProjectMemberInput) => {
    try {
      const projectMember = {
        project: projectId,
        member: data.member,
        role: data.role,
      };
      await createProjectMember(projectMember);
      toaster.success({
        title: "성공",
      });
      getProjectMembers({ projectId });
    } catch (error: any) {
      if (error.non_field_errors) {
        toaster.create({
          title: "경고",
          description: "이미 존재하는 멤버입니다",
          type: "warning",
        });
      } else {
        toaster.error({
          title: "실패",
          description: "오류가 발생했습니다",
        });
      }
    }
  };

  return (
    <Card.Root>
      <Card.Body>
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
            {projectMemberList.length > 0 &&
              projectMemberList.map((projectMember, index) => (
                <TableRow
                  key={projectMember.id}
                  cursor="pointer"
                  _hover={{ backgroundColor: "brand.200" }}
                  borderBottom="1px"
                  fontSize="sm"
                >
                  <TableCell padding={4} align="center">
                    <Avatar
                      shape="rounded"
                      name={projectMember.member.name}
                      size="2xs"
                    />
                    {projectMember.member.name}
                  </TableCell>

                  <TableCell padding={4} textAlign="center" fontSize="xs">
                    {projectMember.member.email}
                  </TableCell>

                  <TableCell padding={4} textAlign="center" fontSize="xs">
                    <RoleBadge role={projectMember.role} />
                  </TableCell>

                  <TableCell padding={4} align="center">
                    <WarnDialog
                      trigger={
                        <IconButton
                          aria-label="remove-member"
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          disabled={role === "viewer"}
                        >
                          <LuUserRoundMinus />
                        </IconButton>
                      }
                      confirmDelete={() =>
                        removeProjectMember(projectMember.id, projectId)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableRoot>
      </Card.Body>
      <Card.Footer padding={4} justifyContent="flex-end">
        <AddProjectMemberDialog
          projectId={projectId}
          addProjectMember={addProjectMember}
        />
      </Card.Footer>
    </Card.Root>
  );
};

export default ProjectMember;
