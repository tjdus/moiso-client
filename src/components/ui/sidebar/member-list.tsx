"use client";
import { Stack } from "@chakra-ui/react";
import MemberItem from "./member-item";

const members = [
  { name: "Alice Johnson", role: "Project Manager", avatarUrl: "/avatars/alice.jpg" },
  { name: "Bob Smith", role: "Backend Developer", avatarUrl: "/avatars/bob.jpg" },
  { name: "Charlie Kim", role: "Frontend Developer", avatarUrl: "/avatars/charlie.jpg" },
];

export default function MemberList() {
  return (
    <Stack gap={3} p={4}>
      {members.map((member) => (
        <MemberItem key={member.name} member={member} />
      ))}
    </Stack>
  );
}
