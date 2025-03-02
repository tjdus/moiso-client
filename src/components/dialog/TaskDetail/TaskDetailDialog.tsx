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
  projectId: string;
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailDialog = ({
  projectId,
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
                  projectId={projectId}
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
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default TaskDetailDialog;
