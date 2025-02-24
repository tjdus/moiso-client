"use client";

import { Box, Center, Text, VStack } from "@chakra-ui/react";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";

export default function ScrollableNumberPicker({
  list,
  selected,
  onSelect,
}: {
  list: string[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const itemHeight = 40;
      const containerHeight = containerRef.current.clientHeight;
      const newScrollTop = selected * itemHeight;
      containerRef.current.scrollTo({ top: newScrollTop, behavior: "smooth" });
    }
  }, [selected]);

  const handleScroll = () => {
    if (containerRef.current) {
      const itemHeight = 40;
      const scrollPosition = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      console.log(scrollPosition, selected);
      const newSelected = Math.max(
        0,
        Math.min(list.length - 1, Math.round(scrollPosition / itemHeight))
      );
      onSelect(newSelected);
    }
  };

  const debouncedHandleScroll = useRef(debounce(handleScroll, 100)).current;

  useEffect(() => {
    return () => {
      debouncedHandleScroll.cancel();
    };
  }, [debouncedHandleScroll]);

  return (
    <VStack gap={0} align="center">
      <Box
        ref={containerRef}
        onScroll={debouncedHandleScroll}
        overflowY="scroll"
        height="120px"
        width="80px"
        border="2px solid #ccc"
        borderRadius="8px"
        scrollBehavior="smooth"
        css={{
          scrollbarWidth: "none", // Firefox에서 스크롤바 숨김
          "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari에서 스크롤바 숨김
          scrollSnapType: "y mandatory",
        }}
      >
        <Center h="40px" />
        {list.map((num, index) => {
          const opacity =
            index === selected
              ? 1
              : index === selected - 1 || index === selected + 1
              ? 0.6
              : 0.3;
          const fontSize = index === selected ? "24px" : "18px";

          return (
            <Center key={index} h="40px" scrollSnapAlign="center">
              <Text
                fontSize={fontSize}
                opacity={opacity}
                transition="opacity 0.3s ease"
              >
                {num}
              </Text>
            </Center>
          );
        })}
        <Center h="40px" />
      </Box>
    </VStack>
  );
}
