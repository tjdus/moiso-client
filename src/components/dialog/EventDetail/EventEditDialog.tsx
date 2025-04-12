"use client";

import EventEditForm from "@/components/form/EventEditForm";
import { DialogRoot, DialogContent } from "@/components/ui/dialog";

const EventEditDialog = ({ teamId, isOpen, onClose } : 
  { teamId: string, isOpen: boolean, onClose: () => void }
  ) => {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={onClose}
      placement="top"
      size="md"
      preventScroll
    >
      <DialogContent mt={10}>
        <EventEditForm teamId={teamId} />
      </DialogContent>
    </DialogRoot>
  );
};

export default EventEditDialog;
