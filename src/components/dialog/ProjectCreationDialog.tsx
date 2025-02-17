"use client";

import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Box } from "@chakra-ui/react";
import ProjectCreationForm from "../form/ProjectCreationForm";
import CreationDialog from "./CreationDialog";

const ProjectCreationDialog = () => {
  return (
    <CreationDialog>
      <ProjectCreationForm />
    </CreationDialog>
  );
};

export default ProjectCreationDialog;
