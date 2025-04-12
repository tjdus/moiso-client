"use client";

import { IconButton } from "@chakra-ui/react";
import EventCreationForm from "@/components/form/EventCreationForm";
import CreationDialog from "../CreationDialog";
import { LuFilePlus2 } from "react-icons/lu";

const triggerButton = (
  <IconButton>
    <LuFilePlus2 />
  </IconButton>
);

const EventCreationDialog = ({ teamId } : { teamId: string }) => {
  return (
    <CreationDialog triggerButton={triggerButton}>
      <EventCreationForm teamId={teamId} />
    </CreationDialog>
  );
};

export default EventCreationDialog;
