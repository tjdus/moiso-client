import { Button, Card, Badge, HStack, VStack, Text } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "../ui/avatar";
import { TaskDTO } from "@/lib/interface/fetchDTOs";

export default function TaskCard({
  task,
  onClick,
}: {
  task: TaskDTO;
  onClick: () => void;
}) {
  return (
    <Card.Root
      width="320px"
      onClick={onClick}
      style={{ cursor: "pointer", padding: "16px" }}
    >
      <VStack align="start" gap={2}>
        <Badge colorScheme={getStatusColor(task.status)}>{task.status}</Badge>

        <Text fontSize="lg" fontWeight="bold">
          {task.title}
        </Text>

        <HStack gap={1}>
          {task.tags.map((tag) => (
            <Badge key={tag.id} colorScheme="purple">
              {tag.name}
            </Badge>
          ))}
        </HStack>

        <Text fontSize="sm">{task.description}</Text>

        <AvatarGroup gap="0" spaceX="-3" size="sm">
          {task.members.map((member) => (
            <Avatar name={member.name} size="sm" />
          ))}
        </AvatarGroup>

        <Text fontSize="xs">
          📅 {formatDate(task.start_at)} ~ {formatDate(task.end_at)}
        </Text>
      </VStack>
    </Card.Root>
  );
}

/* ✅ 상태(status)에 따른 뱃지 색상 설정 */
function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "in-progress":
      return "yellow";
    case "completed":
      return "green";
    case "pending":
      return "red";
    default:
      return "gray";
  }
}

/* ✅ 날짜 형식 변환 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
