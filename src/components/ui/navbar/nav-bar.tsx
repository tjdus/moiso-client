"use client";
import { usePathname } from "next/navigation";
import { 
    Box, 
    Flex, 
    Link as ChakraLink, 
    Button, 
    Container, 
    Center, 
    Stack
} from "@chakra-ui/react";
import {
    Avatar
} from "../avatar";

import NextLink from "next/link";

const menuItems = [
  { name: "Project", href: "/project" },
  { name: "Task", href: "/task" },
  { name: "Document", href: "/document" },
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
    return (
    <Box
        px={6}
        py={3}
        position="fixed"
        top={0}
        left="250px"
        width="calc(100% - 250px)"
        height="20px"
        zIndex={1000}
    >
      <Box 
        bg="white"
        color="black"
        boxShadow="md"
        borderRadius="md"
        mt={2}
      >
        <Flex
        justify="space-between"
        align="center"
        margin={4}
        >
            
        <Stack
        margin={4}
        direction="row"
        h="10"
        gap={10}
        > 
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
