"use client";

import { Box, HStack, Link, Text, Tabs } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

const ProfileBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");
  const isBarOpen = isOpen || activeTab;

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
        <Tabs.Root variant="subtle" gap={4} value={activeTab}>
          <Tabs.List>
            {isBarOpen && (
              <Tabs.Trigger value="profile" asChild padding={4}>
                <Link href="/workspace/my?tab=profile" unstyled>
                  Profile
                </Link>
              </Tabs.Trigger>
            )}
            {isBarOpen && (
              <Tabs.Trigger value="list" asChild padding={4}>
                <Link href="/workspace/my?tab=list" unstyled>
                  List
                </Link>
              </Tabs.Trigger>
            )}

            {isBarOpen && (
              <Tabs.Trigger value="todo" asChild padding={4}>
                <Link href="/workspace/my?tab=todo" unstyled>
                  Todo
                </Link>
              </Tabs.Trigger>
            )}
          </Tabs.List>
        </Tabs.Root>
      </HStack>
    </Box>
  );
};

export default ProfileBar;
