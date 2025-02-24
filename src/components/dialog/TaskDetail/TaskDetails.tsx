"use client";

import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { RadioGroup, Radio } from "../../ui/radio";
import { fetchTaskDetail } from "@/lib/api/fetchApi";
import { TaskDetailDTO } from "@/lib/interface/fetchDTOs";
import { StatusTag } from "../../custom-ui/Tag";
import { TaskForm } from "@/lib/interface/form";
import { Avatar } from "../../ui/avatar";
import { formatToKST } from "@/lib/util/dateFormat";
import { SingleDateTimepicker } from "../../date-picker/DayzedDateTimepicker";
import { Button } from "@chakra-ui/react";
import { LuPencil, LuTrash2, LuX, LuCheck, LuPencilLine } from "react-icons/lu";
import { updateTask } from "@/lib/api/patchApi";
import { toaster } from "../../ui/toaster";
import { deleteTask } from "@/lib/api/deleteApi";
import TaskAssignTable from "./TaskAssignTable";

interface TaskDetailDialogProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

const editableControl = (
  <Editable.Control>
    <Editable.EditTrigger asChild>
      <IconButton variant="ghost" size="xs">
        <LuPencilLine />
      </IconButton>
    </Editable.EditTrigger>
    <Editable.CancelTrigger asChild>
      <IconButton variant="outline" size="xs">
        <LuX />
      </IconButton>
    </Editable.CancelTrigger>
    <Editable.SubmitTrigger asChild>
      <IconButton variant="outline" size="xs">
        <LuCheck />
      </IconButton>
    </Editable.SubmitTrigger>
  </Editable.Control>
);
const TaskDetails = ({ taskId, isOpen, onClose }: TaskDetailDialogProps) => {
  const [taskDetail, setTaskDetail] = useState<TaskDetailDTO | null>(null);
  const [taskForm, setTaskForm] = useState<TaskForm>({
    id: "",
    title: "",
    description: "",
    status: "",
    members: taskDetail?.assigned_members.map((member) => member.id) || [],
    start_at: "",
    end_at: "",
  });
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const response = await fetchTaskDetail(taskId);
        setTaskDetail(response.data);
        setTaskForm({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          status: response.data.status,
          start_at: response.data.start_at,
          end_at: response.data.end_at,
        });
      };
      fetchData();
    }
  }, [taskId, isOpen]);

  const handleEdit = async () => {
    if (taskForm) {
      const response = updateTask(taskForm);
      toaster.promise(response, {
        success: {
          title: "업무 수정 성공",
          description: "업무가 성공적으로 수정되었습니다",
        },
        error: {
          title: "업무 수정 실패",
          description: "업무 수정에 실패했습니다",
        },
        loading: {
          title: "업무 수정 중",
          description: "잠시만 기다려주세요...",
        },
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
      <Card.Body>
        {taskDetail && (
          <DataList.Root orientation="horizontal">
            <DataList.Item>
              <DataList.ItemLabel>제목</DataList.ItemLabel>
              <DataList.ItemValue>
                <Editable.Root
                  defaultValue={taskDetail.title || " "}
                  onValueChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      title: e.value,
                    })
                  }
                >
                  <Editable.Preview />
                  <Editable.Input />
                  {editableControl}
                </Editable.Root>
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>설명</DataList.ItemLabel>
              <DataList.ItemValue>
                <Editable.Root
                  defaultValue={taskDetail.description || ""}
                  onValueChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      description: e.value,
                    })
                  }
                >
                  <Editable.Preview />
                  <Editable.Textarea />
                  {editableControl}
                </Editable.Root>
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>진행 상태</DataList.ItemLabel>
              <DataList.ItemValue>
                <Editable.Root
                  defaultValue={taskForm.status}
                  value={taskForm.status}
                  onValueRevert={() =>
                    setTaskForm({
                      ...taskForm,
                      status: taskDetail.status,
                    })
                  }
                >
                  <Editable.Preview>
                    <StatusTag
                      status={taskForm.status || "not_started"}
                      size="sm"
                    />
                  </Editable.Preview>
                  <Editable.Area>
                    <Editable.Context>
                      {(editable) => (
                        <Editable.Control>
                          {editable.editing ? (
                            <RadioGroup
                              value={taskForm.status}
                              onValueChange={(e) => {
                                setTaskForm({
                                  ...taskForm,
                                  status: e.value,
                                });
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
                          ) : (
                            <></>
                          )}
                        </Editable.Control>
                      )}
                    </Editable.Context>
                  </Editable.Area>
                  {editableControl}
                </Editable.Root>
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>시작일</DataList.ItemLabel>
              <DataList.ItemValue>
                <SingleDateTimepicker
                  date={
                    taskForm?.start_at
                      ? new Date(taskForm.start_at)
                      : new Date()
                  }
                  onDateChange={(date) =>
                    setTaskForm({
                      ...taskForm,
                      start_at: date.toISOString(),
                    })
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>마감일</DataList.ItemLabel>
              <DataList.ItemValue>
                <SingleDateTimepicker
                  date={
                    taskForm?.end_at ? new Date(taskForm.end_at) : new Date()
                  }
                  onDateChange={(date) =>
                    setTaskForm({
                      ...taskForm,
                      end_at: date.toISOString(),
                    })
                  }
                />
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>등록일시</DataList.ItemLabel>
              <DataList.ItemValue>
                {formatToKST({
                  dateString: taskDetail.created_at,
                })}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>작성자</DataList.ItemLabel>
              <DataList.ItemValue>
                {taskDetail.created_by.name}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>최종수정일시</DataList.ItemLabel>
              <DataList.ItemValue>
                {taskDetail.updated_at
                  ? formatToKST({
                      dateString: taskDetail.updated_at,
                    })
                  : "-"}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>수정자</DataList.ItemLabel>
              <DataList.ItemValue>
                {taskDetail.updated_by ? taskDetail.updated_by.name : "-"}
              </DataList.ItemValue>
            </DataList.Item>
            {/* Add more fields as necessary */}
          </DataList.Root>
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default TaskDetails;
