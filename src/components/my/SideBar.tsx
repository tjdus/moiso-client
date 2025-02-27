import {
  Tabs,
  Link,
  Flex,
  Card,
  Stack,
  StackSeparator,
} from "@chakra-ui/react";

const MySideTab = () => {
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
        <Stack gap="2" separator={<StackSeparator />}>
          <Link href="#">Tab 1</Link>
          <Link href="#">Tab 2</Link>
          <Link href="#">Tab 3</Link>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

export default MySideTab;
