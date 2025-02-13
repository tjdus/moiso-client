import { createSystem, defaultConfig } from "@chakra-ui/react";
import colors from "./foundations/color";
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
      colors: {
        ...colors,
      },
    },
  },
});

export default system;
