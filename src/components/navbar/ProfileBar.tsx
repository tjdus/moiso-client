"use client";

import { Box, HStack, Link, Text, Tabs } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ProfileBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab"));
  const isBarOpen = isOpen || tab;

  const router = useRouter();

  const handleTabChange = (tab: string) => {
    setTab(tab);
    router.push(`/workspace/my?tab=${tab}`);
  };

  return (
    <Box
      position="fixed"
      right="10px"
      top="10px"
      width={isBarOpen ? "400px" : "60px"}
      height="60px"
      borderRadius="lg"
      p={3}
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      zIndex={1000}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <HStack
        gap={3}
        mt={3}
        align="stretch"
        width="100%"
        flexDirection="row-reverse"
      >
        <Avatar name="User" size="md" mb={2} alignSelf="flex-end" />
        {isBarOpen && <ColorModeButton />}
        <Tabs.Root
          variant="subtle"
          gap={4}
          value={tab}
          onValueChange={(e) => handleTabChange(e.value)}
        >
          <Tabs.List>
            {isBarOpen && (
              <Tabs.Trigger value="profile" padding={4}>
                Profile
              </Tabs.Trigger>
            )}
            {isBarOpen && (
              <Tabs.Trigger value="list" padding={4}>
                List
              </Tabs.Trigger>
            )}
            `
            {isBarOpen && (
              <Tabs.Trigger value="todo" padding={4}>
                Todo
              </Tabs.Trigger>
            )}
          </Tabs.List>
        </Tabs.Root>
      </HStack>
    </Box>
  );
};

export default ProfileBar;
