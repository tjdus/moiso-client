"use client";

import React, { useEffect, useState } from "react";
import {
  DialogActionTrigger,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/components/ui/dialog";
import { Card, DialogBody, Tabs } from "@chakra-ui/react";
import ProjectDetails from "./ProjectDetails";
import MemberSelectorWithGroup from "@/components/custom-ui/MemberSelectorWithGroup";
import ProjectMember from "./ProjectMemberTable";

interface ProjectDetailDialogProps {
  teamId: string;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailDialog = ({
  teamId,
  projectId,
  isOpen,
  onClose,
}: ProjectDetailDialogProps) => {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={onClose}
      placement="top"
      size="md"
      preventScroll
    >
      <DialogContent mt={10}>
        <DialogBody>
          <Tabs.Root
            variant="outline"
            border="1px"
            defaultValue="details"
            height="xl"
          >
            <Tabs.List gap={1}>
              <Tabs.Trigger padding={2} value="details">
                상세 정보
              </Tabs.Trigger>
              <Tabs.Trigger padding={2} value="members">
                멤버
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content
              value="details"
              children={
                <ProjectDetails
                  teamId={teamId}
                  projectId={projectId}
                  isOpen={isOpen}
                  onClose={onClose}
                />
              }
            ></Tabs.Content>
            <Tabs.Content value="members">
              <ProjectMember projectId={projectId} />
            </Tabs.Content>
          </Tabs.Root>
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ProjectDetailDialog;
