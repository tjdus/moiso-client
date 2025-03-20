"use client";

import { Card, DataList, Tabs } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import TeamMemberDetails from "./TeamMemberDetails";
import TeamMemberProjectTable from "./TeamMemberProjects";
import { DialogBody, DialogContent, DialogRoot } from "@/components/ui/dialog";
import { TeamMemberDTO } from "@/lib/api/interface/fetchDTOs";

interface TeamMemberDetailDialogProps {
  teamMember: TeamMemberDTO;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (memberId: string, updatedData: TeamMemberDTO) => void;
}

const TeamMemberDetailDialog = ({
  teamMember,
  isOpen,
  onClose,
  onUpdate,
}: TeamMemberDetailDialogProps) => {
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
          <Tabs.Root variant="outline" border="1px" defaultValue="details">
            <Tabs.List gap={1}>
              <Tabs.Trigger padding={2} value="details">
                정보
              </Tabs.Trigger>
              <Tabs.Trigger padding={2} value="projects">
                참여중인 프로젝트
              </Tabs.Trigger>
              <Tabs.Trigger padding={2} value="tasks">
                업무
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="details">
              <TeamMemberDetails
                teamMemberId={teamMember.id}
                onUpdate={onUpdate}
              />
            </Tabs.Content>
            <Tabs.Content value="projects">
              <TeamMemberProjectTable teamMember={teamMember} />
            </Tabs.Content>
            <Tabs.Content value="my"></Tabs.Content>
          </Tabs.Root>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default TeamMemberDetailDialog;
