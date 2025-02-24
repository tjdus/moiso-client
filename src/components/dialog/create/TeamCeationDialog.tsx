"use client";

import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Box } from "@chakra-ui/react";
import TeamCreationForm from "@/components/form/TeamCreationForm";
import CreationDialog from "../CreationDialog";

const triggerButton = () => <Button>Create Team</Button>;

const TeamCreationDialog = () => {
  return (
    <CreationDialog triggerButton={triggerButton()}>
      <TeamCreationForm />
    </CreationDialog>
  );
};

export default TeamCreationDialog;
