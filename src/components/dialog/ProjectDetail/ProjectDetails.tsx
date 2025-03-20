"use client";

import React, { use, useEffect, useState } from "react";
import {
  DialogActionTrigger,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/components/ui/dialog";
import {
  Card,
  DataList,
  HStack,
  Stack,
  Editable,
  IconButton,
  DialogBody,
  EditablePreview,
  EditableRoot,
  Box,
  Input,
  Text,
  Textarea,
  Separator,
} from "@chakra-ui/react";
import { RadioGroup, Radio } from "../../ui/radio";
import { getProjectDetail, getTaskDetail } from "@/lib/api/getApi";
import {
  CategoryNameDTO,
  ProjectDetailDTO,
  TagDTO,
  TaskDetailDTO,
} from "@/lib/api/interface/fetchDTOs";
import { StatusTag, TagItem } from "../../custom-ui/Tag";
import { ProjectInput, TaskInput } from "@/lib/api/interface/requestDTO";
import { Avatar } from "../../ui/avatar";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import { SingleDateTimepicker } from "../../date-picker/DayzedDateTimepicker";
import { Button } from "@chakra-ui/react";
import { LuPencil, LuTrash2, LuX, LuCheck, LuPencilLine } from "react-icons/lu";
import { updateProject, updateTask } from "@/lib/api/patchApi";
import { toaster } from "../../ui/toaster";
import { deleteProject, deleteTask } from "@/lib/api/deleteApi";
import EditableData from "@/components/custom-ui/EditableData";
import {
  DeleteButton,
  SaveDeleteButton,
} from "@/components/custom-ui/SaveDeleteButton";
import TagSelector from "@/components/custom-ui/TagSelector";
import CategorySelector from "@/components/custom-ui/CategorySelector";
import { SingleDatepicker } from "@/components/date-picker/DayzedDatepicker";
import { useForm } from "react-hook-form";
import { CategoryItem } from "@/components/custom-ui/Category";

interface ProjectDetailDialogProps {
  teamId: string;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetails = ({
  teamId,
  projectId,
  isOpen,
  onClose,
}: ProjectDetailDialogProps) => {
  const [projectDetail, setProjectDetail] = useState<ProjectDetailDTO | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    control,
  } = useForm<ProjectInput>();

  const fetchProject = async () => {
    const response = await getProjectDetail(projectId);
    setProjectDetail(response.data);

    setValue("name", response.data.name);
    setValue("description", response.data.description);
    setValue(
      "members",
      response.data.members.map((member) => member.member.id)
    );
    setValue("category", response.data.category.id);
    setValue("status", response.data.status);
    setValue("start_date", response.data.start_date);
    setValue("end_date", response.data.end_date);
  };

  useEffect(() => {
    if (isOpen) {
      fetchProject();
    }
  }, [projectId, isOpen]);

  const handleDelete = async () => {
    try {
      await deleteProject(projectId); // corrected to use projectId
      toaster.success({
        title: "프로젝트 삭제 성공",
        description: "프로젝트가 삭제되었습니다",
      });
      onClose();
    } catch (error) {
      toaster.error({
        title: "프로젝트 삭제 실패",
        description: "프로젝트 삭제에 실패했습니다",
      });
    }
  };

  const onSubmit = async (name: keyof ProjectInput, data: ProjectInput) => {
    try {
      const response = updateProject(projectId, { [name]: data[name] });
      toaster.promise(response, {
        success: {
          title: "수정되었습니다",
        },
        error: {
          title: "수정 중 문제가 발생했습니다",
        },
        loading: {
          title: "수정 중...",
        },
      });
      await response;
      fetchProject();
    } catch (error) {
      console.error("Failed to update project", error);
    }
  };

  const handleChange = (key: keyof ProjectInput, value: any) => {
    setValue(key, value);
  };

  return (
    <Card.Root padding={10}>
      <Card.Body padding={4}>
        {projectDetail && (
          <DataList.Root orientation="horizontal">
            <DataList.Item>
              <DataList.ItemLabel>제목</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name="name"
                  control={control}
                  onValueCommit={handleSubmit((data) => onSubmit("name", data))}
                  onValueRevert={() => {
                    handleChange("name", projectDetail.name);
                  }}
                  preview={(value) => <Text textStyle="sm">{value}</Text>}
                  edit={(value, onChange) => (
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      width="3xs"
                    />
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>설명</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name="description"
                  control={control}
                  onValueCommit={handleSubmit((data) =>
                    onSubmit("description", data)
                  )}
                  onValueRevert={() => {
                    handleChange("description", projectDetail.description);
                  }}
                  preview={(value) => <Text textStyle="sm">{value}</Text>}
                  edit={(value, onChange) => (
                    <Textarea
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      width="3xs"
                    />
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>진행 상태</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name="status"
                  control={control}
                  onValueCommit={handleSubmit((data) =>
                    onSubmit("status", data)
                  )}
                  onValueRevert={() => {
                    handleChange(
                      "status",
                      projectDetail.status || "not_started"
                    );
                  }}
                  preview={(value) => (
                    <StatusTag status={value || "not_started"} size="sm" />
                  )}
                  edit={(value, onchange) => (
                    <RadioGroup
                      value={value || "not_started"}
                      onValueChange={(e) => onchange(e.value)}
                      size="sm"
                    >
                      <HStack gap={1} width="3xs">
                        <Radio value="not_started">
                          <StatusTag status="not_started" size="sm" />
                        </Radio>
                        <Radio value="in_progress">
                          <StatusTag status="in_progress" size="sm" />
                        </Radio>
                        <Radio value="completed">
                          <StatusTag status="completed" size="sm" />
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>카테고리</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name="category"
                  control={control}
                  onValueCommit={handleSubmit((data) =>
                    onSubmit("category", data)
                  )}
                  onValueRevert={() => {
                    handleChange("category", projectDetail.category || null);
                  }}
                  preview={(value) =>
                    value && value ? <CategoryItem id={value} /> : null
                  }
                  edit={(value, onChange) => (
                    <CategorySelector
                      teamId={teamId}
                      value={value || ""}
                      onValueChange={(item) => onChange(item)}
                    />
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>시작일</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name="start_date"
                  control={control}
                  onValueCommit={handleSubmit((data) =>
                    onSubmit("start_date", data)
                  )}
                  onValueRevert={() => {
                    handleChange(
                      "start_date",
                      projectDetail.start_date || null
                    );
                  }}
                  preview={(value) => (
                    <Text>{formatDateTimeKST({ dateString: value })}</Text>
                  )}
                  edit={(value, onChange) => (
                    <SingleDatepicker
                      date={value ? new Date(value) : new Date()}
                      onDateChange={(date) =>
                        onChange(date.toISOString().split("T")[0])
                      }
                    />
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>종료일</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name="end_date"
                  control={control}
                  onValueCommit={handleSubmit((data) =>
                    onSubmit("end_date", data)
                  )}
                  onValueRevert={() => {
                    handleChange("end_date", projectDetail.end_date || null);
                  }}
                  preview={(value) => (
                    <Text>{formatDateTimeKST({ dateString: value })}</Text>
                  )}
                  edit={(value, onChange) => (
                    <SingleDatepicker
                      date={value ? new Date(value) : new Date()}
                      onDateChange={(date) =>
                        onChange(date.toISOString().split("T")[0])
                      }
                    />
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>등록</DataList.ItemLabel>
              <DataList.ItemValue>
                {formatDateTimeKST({
                  dateString: projectDetail.created_at,
                })}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel></DataList.ItemLabel>
              <DataList.ItemValue>
                {projectDetail.created_by.name}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>수정</DataList.ItemLabel>
              <DataList.ItemValue>
                {projectDetail.updated_at
                  ? formatDateTimeKST({
                      dateString: projectDetail.updated_at,
                    })
                  : "-"}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel></DataList.ItemLabel>
              <DataList.ItemValue>
                {projectDetail.updated_by ? projectDetail.updated_by.name : "-"}
              </DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
        )}
      </Card.Body>
      <Separator />
      <Card.Footer padding={4} justifyContent="flex-end">
        <DeleteButton onDelete={handleDelete} />
      </Card.Footer>
    </Card.Root>
  );
};

export default ProjectDetails;
