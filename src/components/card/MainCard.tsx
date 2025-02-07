import { Card, Box } from "@chakra-ui/react";

export default function MainCard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding="4"
    >
      <Box
        bg="white"
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius="md"
        boxShadow="lg"
      >
        <Card.Root>
          <Card.Body>{children}</Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}
