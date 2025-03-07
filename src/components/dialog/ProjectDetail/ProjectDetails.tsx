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
import { fetchProjectDetail, fetchTaskDetail } from "@/lib/api/fetchApi";
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
import { SaveDeleteButton } from "@/components/custom-ui/SaveDeleteButton";
import TagSelector from "@/components/custom-ui/TagSelector";
import CategorySelector from "@/components/custom-ui/CategorySelector";
import { SingleDatepicker } from "@/components/date-picker/DayzedDatepicker";

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

  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<CategoryNameDTO | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [updatedField, setUpdatedField] = useState<Partial<ProjectInput>>({});

  useEffect(() => {
    if (projectDetail) {
      setId(projectDetail.id);
      setName(projectDetail.name);
      setDescription(projectDetail.description);
      setStatus(projectDetail.status);
      setCategory(projectDetail.category || null);
      setStartDate(projectDetail.start_date);
      setEndDate(projectDetail.end_date);
    }
  }, [projectDetail]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const response = await fetchProjectDetail(projectId);
        setProjectDetail(response.data);
      };
      fetchData();
    }
  }, [id, isOpen]);

  const handleEdit = async () => {
    try {
      await updateProject(projectId, updatedField);
      toaster.success({
        title: "업무 수정 성공",
        description: "업무가 성공적으로 수정되었습니다",
      });
      onClose();
    } catch (error) {
      toaster.error({
        title: "업무 수정 실패",
        description: "업무 수정에 실패했습니다",
      });
    }
  };

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

  return (
    <Card.Root padding={10}>
      <Card.Body padding={4}>
        {projectDetail && (
          <DataList.Root orientation="horizontal">
            <DataList.Item>
              <DataList.ItemLabel>제목</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setName(projectDetail.name || "");
                    setUpdatedField({
                      ...updatedField,
                      name: "",
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      name: name,
                    });
                  }}
                  preview={<Text textStyle="sm">{name}</Text>}
                  edit={
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      width="3xs"
                    />
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>설명</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setDescription(projectDetail.description || "");
                    setUpdatedField({
                      ...updatedField,
                      description: undefined,
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      description: description,
                    });
                  }}
                  preview={<Text textStyle="sm">{description}</Text>}
                  edit={
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      width="3xs"
                    />
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>진행 상태</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setStatus(projectDetail.status || "");
                    setUpdatedField({
                      ...updatedField,
                      status: undefined,
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      status: status,
                    });
                  }}
                  preview={
                    <StatusTag status={status || "not_started"} size="sm" />
                  }
                  edit={
                    <RadioGroup
                      value={status}
                      onValueChange={(e) => setStatus(e.value)}
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
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>카테고리</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setCategory(category || null);
                    setUpdatedField({
                      ...updatedField,
                      category: undefined,
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      category: category?.id || undefined,
                    });
                  }}
                  preview={
                    category && (
                      <TagItem
                        id={category.id}
                        key={category.id}
                        name={category.name}
                        size="sm"
                      />
                    )
                  }
                  edit={
                    <CategorySelector
                      teamId={teamId}
                      value={category ? [category] : []}
                      onValueChange={setCategory}
                    />
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>시작일</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setStartDate(projectDetail.start_date);
                    setUpdatedField({
                      ...updatedField,
                      start_date: undefined,
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      start_date: startDate,
                    });
                  }}
                  preview={
                    <Text>
                      {
                        formatDateTimeKST({ dateString: startDate }).split(
                          " "
                        )[0]
                      }
                    </Text>
                  }
                  edit={
                    <SingleDatepicker
                      date={startDate ? new Date(startDate) : new Date()}
                      onDateChange={(date) =>
                        setStartDate(date.toISOString().split("T")[0])
                      }
                    />
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>종료일</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setEndDate(projectDetail.end_date);
                    setUpdatedField({
                      ...updatedField,
                      end_date: undefined,
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      end_date: endDate,
                    });
                  }}
                  preview={
                    <Text>
                      {formatDateTimeKST({ dateString: endDate }).split(" ")[0]}
                    </Text>
                  }
                  edit={
                    <SingleDatepicker
                      date={endDate ? new Date(endDate) : new Date()}
                      onDateChange={(date) =>
                        setEndDate(date.toISOString().split("T")[0])
                      }
                    />
                  }
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
        <SaveDeleteButton onSave={handleEdit} onDelete={handleDelete} />
      </Card.Footer>
    </Card.Root>
  );
};

export default ProjectDetails;
