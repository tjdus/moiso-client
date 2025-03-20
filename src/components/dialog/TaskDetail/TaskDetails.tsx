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
  useDialog,
} from "@chakra-ui/react";
import { RadioGroup, Radio } from "../../ui/radio";
import { getTaskDetail } from "@/lib/api/getApi";
import { TagDTO, TaskDetailDTO } from "@/lib/api/interface/fetchDTOs";
import { StatusTag, TagBadge, TagItem } from "../../custom-ui/Tag";
import { TaskInput } from "@/lib/api/interface/requestDTO";
import { Avatar } from "../../ui/avatar";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import { SingleDateTimepicker } from "../../date-picker/DayzedDateTimepicker";
import { Button } from "@chakra-ui/react";
import { LuPencil, LuTrash2, LuX, LuCheck, LuPencilLine } from "react-icons/lu";
import { updateTask } from "@/lib/api/patchApi";
import { toaster } from "../../ui/toaster";
import { deleteTask } from "@/lib/api/deleteApi";
import TaskAssignTable from "./TaskAssignTable";
import EditableData from "@/components/custom-ui/EditableData";
import {
  DeleteButton,
  SaveDeleteButton,
} from "@/components/custom-ui/SaveDeleteButton";
import TagSelector from "@/components/custom-ui/TagSelector";
import { useTaskDetailDialog } from "./TaskDetailDialog";
import { useForm } from "react-hook-form";
import { values } from "lodash";

const TaskDetails = ({ taskId }: { taskId: string }) => {
  const [taskDetail, setTaskDetail] = useState<TaskDetailDTO | null>(null);
  const dialog = useTaskDetailDialog();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    control,
  } = useForm<TaskInput>();

  const fetchTask = async () => {
    const response = await getTaskDetail(taskId);
    setTaskDetail(response.data);

    setValue("title", response.data.title);
    setValue("description", response.data.description);
    setValue(
      "members",
      response.data.members.map((member) => member.member.id)
    );
    setValue(
      "tags",
      response.data.tags.map((tag) => tag.tag.id)
    );
    setValue("status", response.data.status);
    setValue("start_at", response.data.start_at);
    setValue("end_at", response.data.end_at);
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const handleDelete = async () => {
    try {
      await deleteTask(taskId);
      toaster.success({
        title: "업무 삭제 성공",
        description: "업무가 삭제되었습니다",
      });
      dialog.setOpen(false);
    } catch (error) {
      toaster.error({
        title: "업무 삭제 실패",
        description: "업무 삭제에 실패했습니다",
      });
    }
  };

  const onSubmit = async (name: keyof TaskInput, data: TaskInput) => {
    try {
      const response = updateTask(taskId, { [name]: data[name] });
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
      fetchTask();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleChange = (key: keyof TaskInput, value: any) => {
    setValue(key, value);
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
                  name="title"
                  control={control}
                  onValueCommit={handleSubmit((data) =>
                    onSubmit("title", data)
                  )}
                  onValueRevert={() => {
                    handleChange("title", taskDetail.title);
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
                    handleChange("description", taskDetail.description);
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
                    handleChange("status", taskDetail.status || "not_started");
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
              <DataList.ItemLabel>태그</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name="tags"
                  control={control}
                  onValueCommit={handleSubmit((data) => onSubmit("tags", data))}
                  onValueRevert={() => {
                    handleChange(
                      "tags",
                      taskDetail.tags.map((tag) => tag.tag.id) || []
                    );
                  }}
                  preview={(value) => (
                    <HStack gap={2}>
                      {Array.isArray(value) && value.length > 0
                        ? value.map((id) => <TagBadge id={id} key={id} />)
                        : null}
                    </HStack>
                  )}
                  edit={(value, onChange) => (
                    <TagSelector
                      projectId={taskDetail.project.id}
                      value={value}
                      onValueChange={onChange}
                    />
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>시작 시간</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name="start_at"
                  control={control}
                  onValueCommit={handleSubmit((data) =>
                    onSubmit("start_at", data)
                  )}
                  onValueRevert={() => {
                    handleChange("start_at", taskDetail.start_at || null);
                  }}
                  preview={(value) => (
                    <Text>{formatDateTimeKST({ dateString: value })}</Text>
                  )}
                  edit={(value, onChange) => (
                    <SingleDateTimepicker
                      date={value ? new Date(value) : new Date()}
                      onDateChange={(date) => onChange(date.toISOString())}
                    />
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>마감 시간</DataList.ItemLabel>
              <DataList.ItemValue>
                <EditableData
                  name="end_at"
                  control={control}
                  onValueCommit={handleSubmit((data) =>
                    onSubmit("end_at", data)
                  )}
                  onValueRevert={() => {
                    handleChange("end_at", taskDetail.end_at || null);
                  }}
                  preview={(value) => (
                    <Text>{formatDateTimeKST({ dateString: value })}</Text>
                  )}
                  edit={(value, onChange) => (
                    <SingleDateTimepicker
                      date={value ? new Date(value) : new Date()}
                      onDateChange={(date) => onChange(date.toISOString())}
                    />
                  )}
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>등록</DataList.ItemLabel>
              <DataList.ItemValue>
                {formatDateTimeKST({
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
                  ? formatDateTimeKST({
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
        <DeleteButton onDelete={handleDelete} />
      </Card.Footer>
    </Card.Root>
  );
};

export default TaskDetails;
