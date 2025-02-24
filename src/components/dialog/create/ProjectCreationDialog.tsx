"use client";

import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Box } from "@chakra-ui/react";
import ProjectCreationForm from "../../form/ProjectCreationForm";
import CreationDialog from "../CreationDialog";

const triggerButton = <Button>새로운 프로젝트 만들기</Button>;

const ProjectCreationDialog = () => {
  return (
    <CreationDialog triggerButton={triggerButton}>
      <ProjectCreationForm />
    </CreationDialog>
  );
};

export default ProjectCreationDialog;
