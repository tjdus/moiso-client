"use client";

import { Box, Center, Text, VStack } from "@chakra-ui/react";
import { useRef } from "react";

const amPmOptions = ["AM", "PM"];

export default function ScrollableAmPmPicker({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const itemHeight = 40;
      const scrollPosition = containerRef.current.scrollTop;
      const newSelected = Math.round(scrollPosition / itemHeight);
      onSelect(newSelected);
    }
  };

  return (
    <VStack gap={0} align="center">
      <Box
        ref={containerRef}
        onScroll={handleScroll}
        overflowY="scroll"
        height="120px"
        width="80px"
        border="2px solid #ccc"
        borderRadius="8px"
        scrollBehavior="smooth"
        scrollSnapType="y mandatory"
        css={{
          scrollbarWidth: "none", // Firefox에서 스크롤바 숨김
          "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari에서 스크롤바 숨김
          scrollSnapType: "y mandatory",
        }}
      >
        <Center h="40px" />
        {amPmOptions.map((option, index) => {
          const opacity = index === selected ? 1 : 0.3;
          const fontSize = index === selected ? "24px" : "18px";

          return (
            <Center key={option} h="40px" scrollSnapAlign="center">
              <Text
                fontSize={fontSize}
                opacity={opacity}
                transition="opacity 0.3s ease"
              >
                {option}
              </Text>
            </Center>
          );
        })}
        <Center h="40px" />
      </Box>
    </VStack>
  );
}
