/**
 * Calendar configuration utilities
 */

// Predefined color palettes for variety
const COLOR_PALETTES = [
  // Blues
  { main: "#1c7df9", container: "#d2e7ff", onContainer: "#002859" },
  // Purples
  { main: "#7c4dff", container: "#e8ddff", onContainer: "#280056" },
  // Greens
  { main: "#2e7d32", container: "#b8e6b8", onContainer: "#00210d" },
  // Oranges
  { main: "#f57c00", container: "#ffddb0", onContainer: "#451a00" },
  // Reds
  { main: "#d32f2f", container: "#ffdad6", onContainer: "#410002" },
  // Teals
  { main: "#00796b", container: "#b2dfdb", onContainer: "#002b28" },
  // Pinks
  { main: "#c2185b", container: "#ffd8e7", onContainer: "#3e001d" },
  // Browns
  { main: "#795548", container: "#d7ccc8", onContainer: "#231917" },
];

// Darken a color for dark mode
const getDarkModeColor = (color: string): string => {
  // Simple implementation - for proper color transformation, use a color library
  const darkOpacity = "88"; // 53% opacity
  const lightOpacity = "ff"; // 100% opacity

  if (color.startsWith("#")) {
    // For main colors, make them lighter in dark mode
    if (color === COLOR_PALETTES[0].main) {
      return "#c0dfff";
    }

    // For container colors, make them darker in dark mode
    if (color === COLOR_PALETTES[0].container) {
      return "#426aa2";
    }

    // For onContainer colors, make them lighter in dark mode
    return "#dee6ff";
  }

  return color;
};

/**
 * Generate deterministic calendar colors based on project ID
 */
export const getProjectCalendarConfig = (projectId: string) => {
  // Use the project ID to select a color palette deterministically
  const idNum = parseInt(projectId, 10) || 0;
  const paletteIndex = idNum % COLOR_PALETTES.length;
  const palette = COLOR_PALETTES[paletteIndex];

  return {
    colorName: `project-${projectId}`,
    lightColors: {
      main: palette.main,
      container: palette.container,
      onContainer: palette.onContainer,
    },
    darkColors: {
      main: getDarkModeColor(palette.main),
      container: getDarkModeColor(palette.onContainer),
      onContainer: getDarkModeColor(palette.container),
    },
  };
};

// Default calendar config
export const DEFAULT_CALENDAR_CONFIG = {
  colorName: "default",
  lightColors: {
    main: "#1c7df9",
    container: "#d2e7ff",
    onContainer: "#002859",
  },
  darkColors: {
    main: "#c0dfff",
    onContainer: "#dee6ff",
    container: "#426aa2",
  },
};
