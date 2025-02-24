"use client";

import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Box, IconButton } from "@chakra-ui/react";
import ProjectCreationForm from "../../form/ProjectCreationForm";
import CreationDialog from "../CreationDialog";
import TaskCreationForm from "../../form/TaskCreationForm";
import { LuClipboard, LuClipboardPlus, LuPlus } from "react-icons/lu";

const triggerButton = (
  <IconButton colorPalette="gray" size="2xs">
    <LuPlus />
  </IconButton>
);

const TaskCreationDialog = () => {
  return (
    <CreationDialog triggerButton={triggerButton}>
      <TaskCreationForm />
    </CreationDialog>
  );
};

export default TaskCreationDialog;
