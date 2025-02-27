import { Button, Link } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LuExternalLink } from "react-icons/lu";

const ProjectButton = ({
  projectId,
  size,
  name,
}: {
  projectId: string;
  size: "sm" | "md" | "lg";
  name: string;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/workspace/project/${projectId}`);
  };

  const color = getButtonColor(projectId);

  return (
    <Button
      size={size}
      colorPalette={color}
      onClick={handleClick}
      padding="4"
      rounded="2xl"
    >
      {name}
    </Button>
  );
};

const ProjectLink = ({
  projectId,
  size,
  name,
}: {
  projectId: string;
  size: "sm" | "md" | "lg";
  name: string;
}) => {
  const color = getButtonColor(projectId);

  return (
    <Link href={`/workspace/project/${projectId}`} variant="underline">
      {name} <LuExternalLink />
    </Link>
  );
};

const BUTTON_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
] as const;

type ButtonColor = (typeof BUTTON_COLORS)[number];

export function getButtonColor(id: string | null | undefined): ButtonColor {
  if (!id) {
    return BUTTON_COLORS[0];
  }
  const colorIndex = parseInt(id) % BUTTON_COLORS.length;

  return BUTTON_COLORS[colorIndex];
}

export { ProjectButton, ProjectLink };
