import { Stack, StackSeparator, Card } from "@chakra-ui/react";

import MenuAccordion from "./MenuAccordion";
import TeamSelectOption from "./TeamSelectOption";

export default function SideBar() {
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
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
