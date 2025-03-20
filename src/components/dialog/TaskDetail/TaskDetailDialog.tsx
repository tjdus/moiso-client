"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import {
  Dialog,
  Portal,
  Tabs,
  useDialog,
  useDialogContext,
  UseDialogReturn,
} from "@chakra-ui/react";

import TaskAssignTable from "./TaskAssignTable";
import TaskDetails from "./TaskDetails";
import MyTaskAssignments from "./MyTaskAssignments";

interface TaskDetailDialogProps extends UseDialogReturn {
  taskId: string;
  setTaskId: (id: string) => void;
}

// Create a context to hold the dialog instance
const TaskDetailDialogContext = createContext<TaskDetailDialogProps | null>(
  null
);

// Update the hook to use our custom context
export const useTaskDetailDialog = () => {
  const context = useContext(TaskDetailDialogContext);
  if (!context) {
    throw new Error(
      "useTaskDetailDialog must be used within a TaskDetailDialogProvider"
    );
  }
  return context;
};

// Create a provider component
export const TaskDetailDialogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dialog = useDialog();
  const [taskId, setTaskId] = useState<string>("");

  return (
    <TaskDetailDialogContext.Provider value={{ ...dialog, setTaskId, taskId }}>
      {children}
    </TaskDetailDialogContext.Provider>
  );
};

const TaskDetailDialog = () => {
  const { taskId, ...dialog } = useTaskDetailDialog();

  console.log(dialog.open);
  return (
    <Dialog.RootProvider value={dialog} placement="top" size="md">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content mt={10}>
            <Dialog.Body>
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
                  children={<TaskDetails taskId={taskId} />}
                ></Tabs.Content>
                <Tabs.Content
                  value="assignees"
                  children={<TaskAssignTable taskId={taskId} />}
                ></Tabs.Content>
                <Tabs.Content value="my">
                  <MyTaskAssignments taskId={taskId} />
                </Tabs.Content>
              </Tabs.Root>
            </Dialog.Body>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};

export default TaskDetailDialog;
