"use client";

import { Stack, StackSeparator, Card, Link } from "@chakra-ui/react";

import MenuAccordion from "./MenuAccordion";
import TeamSelectOption from "./TeamSelectOption";
import { useTeamSpace } from "@/lib/context/TeamContext";

export default function SideBar() {
  const { teamSpace, setTeamSpace } = useTeamSpace();

  return (
    <Card.Root
      w="250px"
      p="4"
      borderRadius="md"
      boxShadow="lg"
      minH="100vh"
      zIndex={100}
    >
      <Card.Body>
        {/* Popover 옵션 */}
        <Stack gap="2" separator={<StackSeparator />}>
          <TeamSelectOption />
          <MenuAccordion />
          {teamSpace && (
            <Link href={`/workspace/team/${teamSpace.id}`}>Team Details</Link>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
