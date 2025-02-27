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
  Tabs,
} from "@chakra-ui/react";
import { RadioGroup, Radio } from "../../ui/radio";

import { TaskDetailDTO } from "@/lib/api/interface/fetchDTOs";
import { StatusTag } from "../../custom-ui/Tag";
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
import TaskDetails from "./TaskDetails";
import MyTaskAssignments from "./MyTaskAssignments";
import { fetchTaskDetail } from "@/lib/api/fetchApi";

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
const TaskDetailDialog = ({
  taskId,
  isOpen,
  onClose,
}: TaskDetailDialogProps) => {
  const [taskDetail, setTaskDetail] = useState<TaskDetailDTO | null>(null);
  const [taskForm, setTaskForm] = useState<TaskForm>({
    id: "",
    title: "",
    description: "",
    status: "",
    members: taskDetail?.members.map((member) => member.id) || [],
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
    <DialogRoot
      open={isOpen}
      onOpenChange={onClose}
      placement="top"
      size="md"
      preventScroll
    >
      <DialogContent mt={10}>
        <DialogBody>
          <Card.Root>
            <Card.Body>
              <Tabs.Root variant="outline" border="1px" defaultValue="details">
                <Tabs.List gap={1}>
                  <Tabs.Trigger padding={2} value="details">
                    Details
                  </Tabs.Trigger>
                  <Tabs.Trigger padding={2} value="assignees">
                    Assignees
                  </Tabs.Trigger>
                  <Tabs.Trigger padding={2} value="my">
                    My
                  </Tabs.Trigger>
                  <Tabs.Indicator />
                </Tabs.List>
                <Tabs.Content
                  value="details"
                  children={
                    <TaskDetails
                      taskId={taskId}
                      isOpen={isOpen}
                      onClose={onClose}
                    />
                  }
                ></Tabs.Content>
                <Tabs.Content
                  value="assignees"
                  children={<TaskAssignTable taskId={taskId} />}
                ></Tabs.Content>
                <Tabs.Content value="my">
                  <MyTaskAssignments taskId={taskId} />
                </Tabs.Content>
              </Tabs.Root>
            </Card.Body>
          </Card.Root>
        </DialogBody>
        <DialogFooter>
          <IconButton colorPalette="yellow" onClick={handleEdit}>
            <LuPencil />
          </IconButton>
          <IconButton colorPalette="red" onClick={() => setIsAlertOpen(true)}>
            <LuTrash2 />
          </IconButton>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>

      <DialogRoot
        open={isAlertOpen}
        onOpenChange={(details) => setIsAlertOpen(details.open)}
        role="alertdialog"
      >
        <DialogContent>
          <DialogBody>삭제하시겠습니까?</DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button colorPalette="red" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </DialogRoot>
  );
};

export default TaskDetailDialog;
