"use client";

import { fetchMemberDetail } from "@/lib/api/fetchApi";
import { MemberDTO, TeamMemberDetailDTO } from "@/lib/interface/fetchDTOs";
import { Card, DataList, Tabs } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import TeamMemberDetails from "./TeamMemberDetails";
import TeamMemberProjectTable from "./TeamMemberProjects";
import { DialogBody, DialogContent, DialogRoot } from "@/components/ui/dialog";

interface TeamMemberDetailDialogProps {
  details: TeamMemberDetailDTO;
  isOpen: boolean;
  onClose: () => void;
}

const TeamMemberDetailDialog = ({
  details,
  isOpen,
  onClose,
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
          <Card.Root padding={10}>
            <Card.Body>
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
                    member={details.member}
                    projects={details.projects}
                    role_groups={details.role_groups}
                  />
                </Tabs.Content>
                <Tabs.Content value="projects">
                  <TeamMemberProjectTable projects={details.projects} />
                </Tabs.Content>
                <Tabs.Content value="my"></Tabs.Content>
              </Tabs.Root>
            </Card.Body>
          </Card.Root>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default TeamMemberDetailDialog;
