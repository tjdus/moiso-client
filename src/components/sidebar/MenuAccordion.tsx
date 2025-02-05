"use client";
import { useState } from "react";
import {
  Stack,
  Text,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@chakra-ui/react";

import MemberList from "./member-list";
import ProjectList from "./project-list";

export default function MenuAccordion() {
  return (
      <AccordionRoot collapsible defaultValue={["members"]}>
        <AccordionItem value="members">
            <AccordionItemTrigger fontSize="lg" fontWeight="bold" p={3} color="black">
                Team Members
            </AccordionItemTrigger>
            <AccordionItemContent p={4} fontSize="md" color="gray.700">
                <MemberList />
            </AccordionItemContent>
        </AccordionItem>
        <AccordionItem value="projects">
            <AccordionItemTrigger fontSize="lg" fontWeight="bold" p={3} color="black">
                Project List
            </AccordionItemTrigger>
            <AccordionItemContent p={4} fontSize="md" color="gray.700">
                <ProjectList />
            </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
  );
}

const items = [
  { value: "members", title: "Team Members", text: "List of all members..." },
  { value: "project-list", title: "Project List", text: "All active projects..." },
];
