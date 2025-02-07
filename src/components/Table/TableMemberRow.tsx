import { Badge, TableCell, TableRow } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { TeamMemberInfoDTO } from "@/lib/interface/work";

export default function TableMemberRow({
  id,
  member,
  role,
  joined_at,
}: TeamMemberInfoDTO) {
  return (
    <TableRow _hover={{ bg: "gray.50" }}>
      <TableCell>
        <Avatar size="sm" />
      </TableCell>

      <TableCell fontWeight="bold">{member.name}</TableCell>

      <TableCell color="gray.600" fontSize="sm">
        {member.email}
      </TableCell>

      <TableCell>
        <Badge colorScheme={role === "Manager" ? "red" : "blue"}>{role}</Badge>
      </TableCell>

      <TableCell fontSize="sm">{joined_at}</TableCell>
    </TableRow>
  );
}
