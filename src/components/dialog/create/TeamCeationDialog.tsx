"use client";

import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Box, IconButton } from "@chakra-ui/react";
import TeamCreationForm from "@/components/form/TeamCreationForm";
import CreationDialog from "../CreationDialog";
import { LuFilePlus2 } from "react-icons/lu";

const triggerButton = () => (
  <IconButton>
    <LuFilePlus2 />
  </IconButton>
);

const TeamCreationDialog = () => {
  return (
    <CreationDialog triggerButton={triggerButton()}>
      <TeamCreationForm />
    </CreationDialog>
  );
};

export default TeamCreationDialog;
