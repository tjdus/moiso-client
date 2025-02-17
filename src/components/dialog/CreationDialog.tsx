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

const CreationDialog = ({ children }: CreationDialogProps) => {
  return (
    <DialogRoot placement="center">
      <DialogTrigger asChild>
        <Button>+</Button>
      </DialogTrigger>
      <DialogContent>
        <Card.Root>
          <Card.Body>{children}</Card.Body>
        </Card.Root>
      </DialogContent>
    </DialogRoot>
  );
};

export default CreationDialog;
