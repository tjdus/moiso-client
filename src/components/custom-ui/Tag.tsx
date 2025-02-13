import { Tag } from "@chakra-ui/react";

interface TagProps {
    id: string;
    name: string;
    size: "sm" | "md" | "lg";
}   

function TagItem({ id, name, size }: TagProps) {
  const colorScheme = getTagColor(id);

  return (  
    <Tag.Root gap={2} size={size} colorPalette={colorScheme} variant="solid">
        <Tag.Label px={2}>{name}</Tag.Label>
    </Tag.Root>
  );
}

const STATUS_LABELS = {
  not_started: '시작 전',
  in_progress: '진행 중',
  completed: '완료됨'
} as const;

function StatusTag({ status, size }: { status: string, size: "sm" | "md" | "lg" }) {
    const colorScheme = getStatusTagColor(status as TaskStatus);
    const label = STATUS_LABELS[status as TaskStatus] || status;

    return (
        <Tag.Root gap={2} size={size} colorPalette={colorScheme} variant="subtle">
            <Tag.Label px={2}>{label}</Tag.Label>
        </Tag.Root>
    );
}

const TAG_COLORS = [
  "gray",
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

type TagColor = typeof TAG_COLORS[number];

export function getTagColor(id: string | null | undefined): TagColor {
  if (!id) {
    return TAG_COLORS[0];
  }
  const colorIndex = parseInt(id) % TAG_COLORS.length;
  
  return TAG_COLORS[colorIndex];
}

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export function getStatusTagColor(status: TaskStatus): TagColor {
  switch (status) {
    case 'not_started':
      return 'gray';
    case 'in_progress':
      return 'blue';
    case 'completed':
      return 'green';
    default:
      return 'gray';
  }
}

export { TagItem, StatusTag };