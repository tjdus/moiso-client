"use client";

import { useContext, useEffect, useState } from "react";
import { TeamSpaceContext } from "@/lib/context/TeamContext";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableColumnHeader,
  TableRow,
  TableCell,
} from "@chakra-ui/react";
import TableMemberRow from "./TableMemberRow";
import { useTeam } from "@/lib/hooks";

const headers = ["Profile", "Name", "Email", "Role", "Joined At"];

export default function Table() {
  const team = useTeam();
  const members = team?.members || [];

  if (!team) {
    return <p>팀 데이터를 불러올 수 없습니다.</p>;
  }

  return (
    <TableRoot
      size="lg"
      interactive
      backgroundColor="white"
      border="1px solid #E2E8F0"
      overflow="hidden"
    >
      <TableHeader fontSize="xl">
        <TableRow>
          {headers.map((header, index) => (
            <TableColumnHeader key={index} padding={4}>
              {header}
            </TableColumnHeader>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.length > 0 ? (
          members.map((member) => (
            <TableMemberRow key={member.id} {...member} />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} textAlign="center">
              팀 멤버가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableRoot>
  );
}
