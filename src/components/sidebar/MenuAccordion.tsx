"use client";
import { useState } from "react";
import {
  Stack,
  Text,
  Tabs,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@chakra-ui/react";

import MemberList from "./MemberList";
import ProjectList from "./ProjectList";
import ProjectCreationDialog from "../dialog/ProjectCreationDialog";

export default function MenuAccordion() {
  return (
    <AccordionRoot collapsible defaultValue={["members"]}>
      <AccordionItem value="members">
        <AccordionItemTrigger fontSize="lg" fontWeight="bold" p={3}>
          Team Members
        </AccordionItemTrigger>
        <AccordionItemContent p={4} fontSize="md">
          <MemberList />
        </AccordionItemContent>
      </AccordionItem>
      <AccordionItem value="projects">
        <AccordionItemTrigger fontSize="lg" fontWeight="bold" p={3}>
          Project List
        </AccordionItemTrigger>
        <AccordionItemContent p={4} fontSize="md">
          <ProjectList />
          <ProjectCreationDialog />
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

const items = [
  { value: "members", title: "Team Members", text: "List of all members..." },
  {
    value: "project-list",
    title: "Project List",
    text: "All active projects...",
  },
];
