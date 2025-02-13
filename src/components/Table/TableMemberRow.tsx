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
    <TableRow _hover={{ bg: "gray.50" }} padding={4}>
      <TableCell
        padding={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar size="sm" />
      </TableCell>

      <TableCell align="left" fontWeight="bold">
        {member.name}
      </TableCell>

      <TableCell color="gray.600" fontSize="sm" textAlign="left">
        {member.email}
      </TableCell>

      <TableCell textAlign="center">
        <Badge colorScheme={role === "Manager" ? "red" : "blue"}>{role}</Badge>
      </TableCell>

      <TableCell fontSize="sm" textAlign="center">
        {joined_at}
      </TableCell>
    </TableRow>
  );
}
