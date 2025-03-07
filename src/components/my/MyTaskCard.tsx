import { Button, Card, Badge, HStack, VStack, Text } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { TaskAssignmentDTO, TaskDTO } from "@/lib/api/interface/fetchDTOs";
import { StatusTag, TagItem } from "../custom-ui/Tag";
import { formatDateTimeKST } from "@/lib/util/dateFormat";

export default function MyTaskCard({
  taskAssignment,
  onClick,
}: {
  taskAssignment: TaskAssignmentDTO;
  onClick: () => void;
}) {
  return (
    <Card.Root width="320px" style={{ cursor: "pointer", padding: "16px" }}>
      <HStack gap={4} align="start">
        <Checkbox onCheckedChange={onClick} colorPalette="green" />
        <VStack align="start" gap={2}>
          <Text fontSize="lg" fontWeight="bold">
            {taskAssignment.task.title}
          </Text>

          <TagItem
            id={taskAssignment.task.project.id}
            name={taskAssignment.task.project.name}
            size="md"
          />

          <HStack gap={1}>
            {taskAssignment.task.tags.map((taskTag) => (
              <Badge key={taskTag.tag.id} colorScheme="purple">
                {taskTag.tag.name}
              </Badge>
            ))}
          </HStack>

          <Text fontSize="sm">{taskAssignment.task.description}</Text>

          <Text fontSize="xs">
            {formatDateTimeKST({ dateString: taskAssignment.task.start_at })} -
            {formatDateTimeKST({ dateString: taskAssignment.task.end_at })}
          </Text>
        </VStack>
      </HStack>
    </Card.Root>
  );
}
