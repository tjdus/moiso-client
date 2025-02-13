import { Card, Box } from "@chakra-ui/react";

export default function MainCard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      padding="4"
      width="100%"
      overflow="hidden"
    >
      <Box
        bg="white"
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        borderRadius="md"
        boxShadow="lg"
        overflow="auto"
        padding="4"
      >
        {children}
      </Box>
    </Box>
  );
}
