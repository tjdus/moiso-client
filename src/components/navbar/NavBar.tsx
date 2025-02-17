"use client";
import { usePathname } from "next/navigation";
import {
  Box,
  Flex,
  Link as ChakraLink,
  Button,
  Container,
  Center,
  Stack,
} from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";

import NextLink from "next/link";
import { useProject } from "@/lib/hooks";

const menuItems = [
  { name: "Overview", href: "/overview" },
  { name: "Task", href: "/workspace/task" },
  { name: "Members", href: "/workspace/members" },
  { name: "Budget", href: "/budget" },
];

interface ItemDTO {
  name: string;
  href: string;
}

function NavBarItem({ item }: { item: ItemDTO }) {
  const pathname = usePathname();
  const isActive = pathname === item.href; // 현재 경로와 비교

  return (
    <ChakraLink asChild>
      <NextLink href={item.href}>{item.name}</NextLink>
    </ChakraLink>
  );
}

export default function NavBar() {
  const project = useProject();
  if (project === null) {
    return <div></div>;
  }
  return (
    <Box
      px={6}
      py={3}
      position="fixed"
      top={0}
      width="100%"
      height="20px"
      zIndex={1000}
    >
      <Box boxShadow="md" borderRadius="md" mt={2}>
        <Flex justify="space-between" align="center" margin={4}>
          <Stack margin={4} direction="row" h="10" gap={10}>
            {/* 네비게이션 메뉴 */}
            {menuItems.map((item) => (
              <NavBarItem key={item.name} item={item} />
            ))}
          </Stack>
          <Avatar />
        </Flex>
      </Box>
    </Box>
  );
}
