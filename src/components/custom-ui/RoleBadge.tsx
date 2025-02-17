import type { Role } from "@/lib/interface/common";
import { Badge } from "@chakra-ui/react";

const roleColor = {
  manager: "orange",
  member: "blue",
  leader: "gray",
} as const;

const roleLabel = {
  manager: "관리자",
  member: "멤버",
  leader: "리더",
} as const;

const RoleBadge = ({ role }: { role: Role }) => {
  return (
    <Badge px={2} variant="solid" size="sm" colorPalette={roleColor[role]}>
      {roleLabel[role]}
    </Badge>
  );
};

export { RoleBadge };
