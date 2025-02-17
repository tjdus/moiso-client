import NavBar from "@/components/navbar/NavBar";
import MainCard from "@/components/card/MainCard";
import { Flex, Box } from "@chakra-ui/react";
import TabBar from "@/components/navbar/TabBar";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
