import { Stack, StackSeparator, Box } from "@chakra-ui/react";

import MenuAccordion from "./MenuAccordion";
import TeamSelectOption from "./TeamSelectOption";

export default function SideBar() {
  return (
    <Box
      w="250px"
      bg="white"
      color="white"
      p="4"
      borderRadius="md"
      boxShadow="lg"
      minH="100vh"
    >
      {/* Popover 옵션 */}
      <Stack gap="2" separator={<StackSeparator />}>
        <TeamSelectOption />
        <MenuAccordion />
      </Stack>
    </Box>
  );
}
