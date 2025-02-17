"use client";

import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Box } from "@chakra-ui/react";
import ProjectCreationForm from "../form/ProjectCreationForm";
import CreationDialog from "./CreationDialog";
import TaskCreationForm from "../form/TaskCreationForm";

const TaskCreationDialog = () => {
  return (
    <CreationDialog>
      <TaskCreationForm />
    </CreationDialog>
  );
};

export default TaskCreationDialog;
