"use client";

import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Box, IconButton } from "@chakra-ui/react";
import ProjectCreationForm from "../../form/ProjectCreationForm";
import CreationDialog from "../CreationDialog";
import { LuFilePlus2 } from "react-icons/lu";

const triggerButton = (
  <IconButton>
    <LuFilePlus2 />
  </IconButton>
);

const ProjectCreationDialog = ({ teamId } : { teamId: string }) => {
  return (
    <CreationDialog triggerButton={triggerButton}>
      <ProjectCreationForm teamId={teamId} />
    </CreationDialog>
  );
};

export default ProjectCreationDialog;
