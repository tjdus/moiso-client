"use client";

import React, { useEffect, useState } from "react";
import {
  DialogActionTrigger,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/components/ui/dialog";
import { DialogBody, Tabs } from "@chakra-ui/react";

import TaskAssignTable from "./TaskAssignTable";
import TaskDetails from "./TaskDetails";
import MyTaskAssignments from "./MyTaskAssignments";

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
