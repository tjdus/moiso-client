import type { Role } from "@/lib/api/interface/common";
import { Badge } from "@chakra-ui/react";

const roleColor = {
  manager: "orange",
  viewer: "blue",
  editor: "gray",
} as const;

const roleLabel = {
  manager: "관리",
  viewer: "조회",
  editor: "수정",
} as const;

const RoleBadge = ({ role }: { role: Role }) => {
  return (
    <Badge px={2} variant="solid" size="sm" colorPalette={roleColor[role]}>
      {roleLabel[role]}
    </Badge>
  );
};

export { RoleBadge };
