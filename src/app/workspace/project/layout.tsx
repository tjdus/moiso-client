import NavBar from "@/components/navbar/NavBar";
import MainCard from "@/components/card/MainCard";
import { Flex, Box } from "@chakra-ui/react";
import TabBar from "@/components/navbar/TabBar";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      direction="column"
      minH="100vh"
      left="250px"
      height="100%"
      width="calc(100% - 250px)"
    >
      {children}
    </Flex>
  );
}
