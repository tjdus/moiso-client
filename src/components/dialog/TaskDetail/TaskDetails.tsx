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
import { fetchTaskDetail } from "@/lib/api/fetchApi";
import { TagDTO, TaskDetailDTO } from "@/lib/api/interface/fetchDTOs";
import { StatusTag, TagItem } from "../../custom-ui/Tag";
import { TaskForm } from "@/lib/api/interface/form";
import { Avatar } from "../../ui/avatar";
import { formatToKST } from "@/lib/util/dateFormat";
import { SingleDateTimepicker } from "../../date-picker/DayzedDateTimepicker";
import { Button } from "@chakra-ui/react";
import { LuPencil, LuTrash2, LuX, LuCheck, LuPencilLine } from "react-icons/lu";
import { updateTask } from "@/lib/api/patchApi";
import { toaster } from "../../ui/toaster";
import { deleteTask } from "@/lib/api/deleteApi";
import TaskAssignTable from "./TaskAssignTable";
import EditableData from "@/components/custom-ui/EditableData";
import { SaveDeleteButton } from "@/components/custom-ui/SaveDeleteButton";
import TagSelector from "@/components/custom-ui/TagSelector";

interface TaskDetailDialogProps {
  projectId: string;
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetails = ({
  projectId,
  taskId,
  isOpen,
  onClose,
}: TaskDetailDialogProps) => {
  const [taskDetail, setTaskDetail] = useState<TaskDetailDTO | null>(null);

  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [startAt, setStartAt] = useState<string>("");
  const [endAt, setEndAt] = useState<string>("");
  const [updatedField, setUpdatedField] = useState<Partial<TaskForm>>({});

  useEffect(() => {
    if (taskDetail) {
      setId(taskDetail.id);
      setTitle(taskDetail.title);
      setDescription(taskDetail.description);
      setStatus(taskDetail.status);
      setTags(taskDetail.tags.map((tag) => tag.tag) || []);
      setStartAt(taskDetail.start_at);
      setEndAt(taskDetail.end_at);
    }
  }, [taskDetail]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const response = await fetchTaskDetail(taskId);
        setTaskDetail(response.data);
      };
      fetchData();
    }
  }, [taskId, isOpen]);

  const handleEdit = async () => {
    try {
      await updateTask(taskId, updatedField);
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
      await deleteTask({ taskId });
      toaster.success({
        title: "업무 삭제 성공",
        description: "업무가 삭제되었습니다",
      });
      onClose();
    } catch (error) {
      toaster.error({
        title: "업무 삭제 실패",
        description: "업무 삭제에 실패했습니다",
      });
    }
  };

  return (
    <Card.Root padding={10}>
      <Card.Body padding={4}>
        {taskDetail && (
          <DataList.Root orientation="horizontal">
            <DataList.Item>
              <DataList.ItemLabel>제목</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setTitle(taskDetail.title || "");
                    setUpdatedField({
                      ...updatedField,
                      title: "",
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      title: title,
                    });
                  }}
                  preview={<Text textStyle="sm">{title}</Text>}
                  edit={
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                    setDescription(taskDetail.description || "");
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
                    setStatus(taskDetail.status || "");
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
              <DataList.ItemLabel>태그</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setTags(tags || []);
                    setUpdatedField({
                      ...updatedField,
                      tags: [],
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      tags: tags.map((tag) => tag.id),
                    });
                  }}
                  preview={
                    <HStack gap={2}>
                      {tags.map((tag, index) => (
                        <TagItem
                          id={tag.id}
                          key={index}
                          name={tag.name}
                          size="sm"
                        />
                      ))}
                    </HStack>
                  }
                  edit={
                    <TagSelector
                      projectId={projectId}
                      value={tags}
                      onValueChange={setTags}
                    />
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>시작 시간</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setStartAt(taskDetail.start_at);
                    setUpdatedField({
                      ...updatedField,
                      start_at: undefined,
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      start_at: startAt,
                    });
                  }}
                  preview={<Text>{formatToKST({ dateString: startAt })}</Text>}
                  edit={
                    <SingleDateTimepicker
                      date={startAt ? new Date(startAt) : new Date()}
                      onDateChange={(date) => setStartAt(date.toISOString())}
                    />
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>마감 시간</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  onValueRevert={() => {
                    setEndAt(taskDetail.end_at);
                    setUpdatedField({
                      ...updatedField,
                      end_at: undefined,
                    });
                  }}
                  onValueCommit={() => {
                    setUpdatedField({
                      ...updatedField,
                      end_at: endAt,
                    });
                  }}
                  preview={<Text>{formatToKST({ dateString: endAt })}</Text>}
                  edit={
                    <SingleDateTimepicker
                      date={endAt ? new Date(endAt) : new Date()}
                      onDateChange={(date) => setEndAt(date.toISOString())}
                    />
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>등록</DataList.ItemLabel>
              <DataList.ItemValue>
                {formatToKST({
                  dateString: taskDetail.created_at,
                })}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel></DataList.ItemLabel>
              <DataList.ItemValue>
                {taskDetail.created_by.name}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>수정</DataList.ItemLabel>
              <DataList.ItemValue>
                {taskDetail.updated_at
                  ? formatToKST({
                      dateString: taskDetail.updated_at,
                    })
                  : "-"}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel></DataList.ItemLabel>
              <DataList.ItemValue>
                {taskDetail.updated_by ? taskDetail.updated_by.name : "-"}
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

export default TaskDetails;
