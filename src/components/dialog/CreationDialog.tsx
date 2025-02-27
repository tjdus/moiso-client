"use client";

import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Box, Card, CardRoot } from "@chakra-ui/react";

interface CreationDialogProps {
  children: React.ReactNode;
}

const CreationDialog = ({
  children,
  triggerButton,
}: CreationDialogProps & { triggerButton: React.ReactNode }) => {
  return (
    <DialogRoot placement="center">
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <CardRoot>
          <Box p={4}>{children}</Box>
        </CardRoot>
      </DialogContent>
    </DialogRoot>
  );
};

export default CreationDialog;
