import { Box, HStack, Card } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { ColorModeButton } from "@/components/ui/color-mode";

const ProfileBar = () => {
  return (
    <Box
      p={4}
      position={"absolute"}
      width="200px"
      height="60px"
      top={0}
      right={0}
      zIndex={1000}
    >
      <Card.Root>
        <Card.Body>
          <HStack gap={4}>
            <ColorModeButton />
            <Avatar name="User Name" />
          </HStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default ProfileBar;
