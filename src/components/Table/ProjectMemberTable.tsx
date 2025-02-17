"use client";

import {
  TableRoot,
  TableHeader,
  TableBody,
  TableColumnHeader,
  TableRow,
  TableCell,
  Badge,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useProject } from "@/lib/hooks";
import { ProjectDetailDTO } from "@/lib/interface/fetchDTOs";

import { Avatar } from "../ui/avatar";
import { ProjectMemberInfoDTO } from "@/lib/interface/fetchDTOs";
import { RoleBadge } from "../custom-ui/RoleBadge";
import type { Role } from "@/lib/interface/common";

const ProjectMemberRow = ({
  id,
  member,
  role,
  joined_at,
}: ProjectMemberInfoDTO) => {
  return (
    <TableRow _hover={{ bg: "gray.300" }}>
      <TableCell align="center" height="48px">
        <HStack>
          <Avatar size="xs" />
          <Text fontWeight="light" fontSize="sm">
            {member.name}
          </Text>
        </HStack>
      </TableCell>

      <TableCell fontSize="xs" textAlign="center" height="48px">
        {member.email}
      </TableCell>

      <TableCell textAlign="center" height="48px">
        <RoleBadge role={role as Role} />
      </TableCell>

      <TableCell fontSize="xs" textAlign="center" height="48px">
        {joined_at}
      </TableCell>
    </TableRow>
  );
};

const headers = ["이름", "이메일", "역할", "가입일"];

export default function ProjectMemberTable() {
  const project = useProject() as ProjectDetailDTO | null;
  const members = project?.members || [];

  if (!project) {
    return <p>프로젝트 데이터를 불러올 수 없습니다.</p>;
  }

  return (
    <TableRoot
      size="lg"
      interactive
      border="1px solid gray.700"
      overflow="hidden"
    >
      <TableHeader fontSize="sm">
        <TableRow>
          {headers.map((header, index) => (
            <TableColumnHeader
              key={index}
              padding={4}
              textAlign="center"
              height="48px"
            >
              {header}
            </TableColumnHeader>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.length > 0 ? (
          members.map((member) => (
            <ProjectMemberRow key={member.id} {...member} />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} textAlign="center">
              프로젝트 멤버가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableRoot>
  );
}
