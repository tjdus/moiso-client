import { HStack, Separator, Tag } from "@chakra-ui/react";

interface TeamGroupTagProp {
  size: "sm" | "md" | "lg";
  id: string;
  label: string;
}

const TeamGroupTag = ({ size, label }: TeamGroupTagProp) => {
  return (
    <Tag.Root size={size} rounded="full" pr={4} pl={4} colorPalette="gray">
      <Tag.Label>{label}</Tag.Label>
    </Tag.Root>
  );
};

const TeamGroupSeparator = ({ label }: { label: string }) => {
  return (
    <HStack>
      {label}
      <Separator />
    </HStack>
  );
};

export { TeamGroupTag, TeamGroupSeparator };
