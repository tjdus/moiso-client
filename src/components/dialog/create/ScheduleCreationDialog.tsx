"use client";

import { IconButton } from "@chakra-ui/react";
import ScheduleCreationForm from "@/components/form/ScheduleCreationForm";
import CreationDialog from "../CreationDialog";
import { LuFilePlus2 } from "react-icons/lu";

const triggerButton = (
  <IconButton>
    <LuFilePlus2 />
  </IconButton>
);

const ScheduleCreationDialog = () => {
  return (
    <CreationDialog triggerButton={triggerButton}>
      <ScheduleCreationForm />
    </CreationDialog>
  );
};

export default ScheduleCreationDialog;
