"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import system from "@/theme";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" enableSystem={true}>
        <ColorModeProvider {...props} />
      </ThemeProvider>
    </ChakraProvider>
  );
}
