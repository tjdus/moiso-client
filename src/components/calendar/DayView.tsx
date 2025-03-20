"use client";

import { TaskAssignmentDTO } from "@/lib/api/interface/fetchDTOs";
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { isDateInRange, isDateTimeInRange } from "@/lib/util/dateFormat";
import { Calendar, RenderProps, SingleDatepickerConfigs } from "./d";
import { useEffect, useState } from "react";
import { getMyTaskAssignmentList } from "@/lib/api/getApi";

const TIMELINE_HEIGHT = 50;

interface EventBoxProps {
  event: TaskAssignmentDTO;
}

interface DayViewProps {
  events: TaskAssignmentDTO[];
  configs: SingleDatepickerConfigs;
  date: Date;
  onClickMoreButton: (id: string) => void;
}

const DayView = (props: DayViewProps) => {
  const { events, date } = props;
  const [timeMap, setTimeMap] = useState<Map<string, number>>(new Map());
  const [dayEvents, setDayEvents] = useState<TaskAssignmentDTO[]>([]);
  const [allDayEvents, setAllDayEvents] = useState<TaskAssignmentDTO[]>([]);

  // Update dayEvents state when props.events changes
  useEffect(() => {
    const startDate = new Date(date.setHours(0, 0, 0, 0));
    const filteredEvents = events.filter((event) => {
      const eventStartDate = new Date(event.task.start_at);
      return eventStartDate.toDateString() === startDate.toDateString();
    });
    setDayEvents(filteredEvents);

    const filteredAllDayEvents = events.filter((event) => {
      const eventStartDate = new Date(event.task.start_at);
      const eventEndDate = new Date(event.task.end_at);
      return (
        eventStartDate.toDateString() < startDate.toDateString() &&
        eventEndDate.toDateString() > startDate.toDateString()
      );
    });
    setAllDayEvents(filteredAllDayEvents);
  }, [date, events]);

  // Hours to display (24-hour format)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventIndex = (events: TaskAssignmentDTO[]) => {
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => {
      return (
        new Date(a.task.start_at).getTime() -
        new Date(b.task.start_at).getTime()
      );
    });

    const timeMap = new Map<string, number>();

    // For each event, find its appropriate column
    sortedEvents.forEach((event) => {
      const eventStartTime = new Date(event.task.start_at).getTime();

      // Find all events that overlap with this one and started earlier
      const overlappingEvents = sortedEvents.filter((otherEvent) => {
        if (otherEvent === event) return false;

        const otherStartTime = new Date(otherEvent.task.start_at).getTime();
        const otherEndTime = new Date(otherEvent.task.end_at).getTime();

        // Check if other event starts before current event and ends after current event starts
        return otherStartTime < eventStartTime && otherEndTime > eventStartTime;
      });

      // Get all column indices already used by overlapping events
      const usedIndices = new Set(
        overlappingEvents.map((e) => timeMap.get(e.task.id) || 0)
      );

      // Find the first available column
      let index = 0;
      while (usedIndices.has(index)) {
        index++;
      }

      timeMap.set(event.task.id, index);
    });

    return timeMap;
  };

  // Calculate position and height for each event based on start/end times
  const getEventStyle = (event: TaskAssignmentDTO) => {
    const startDate = new Date(event.task.start_at);
    const endDate = new Date(event.task.end_at);

    // If event starts before current day, set start time to 00:00
    const startHour =
      date.toDateString() === startDate.toDateString()
        ? startDate.getHours() + startDate.getMinutes() / 60
        : 0;

    // If event ends after current day, set end time to 23:59
    const endHour =
      date.toDateString() === endDate.toDateString()
        ? endDate.getHours() + endDate.getMinutes() / 60
        : 24;

    const top = `${(startHour / 24) * 100 + 100 / 60}%`;
    const height = `${((endHour - startHour) / 24) * 100}%`;

    return { top, height };
  };

  // Calculate horizontal position to handle overlapping events
  const getHorizontalPosition = (event: TaskAssignmentDTO, index: number) => {
    // Simple algorithm - just distribute events evenly
    const width = Math.max(80 - index * 30, 30); // Min width 30%
    const left = 20 + index * 30;
    return { width: `${width}%`, left: `${left}%` };
  };

  // Format date for header
  const dateHeader = date.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const dateNummericHeader = date.toLocaleDateString("en-US", {
    day: "numeric",
  });

  const getEventColor = (projectId: string) => {
    // Color mapping based on project ID
    const colors = [
      "red.300",
      "blue.300",
      "green.300",
      "purple.300",
      "yellow.300",
      "orange.300",
      "pink.300",
      "teal.300",
    ];

    // Simple hash function to get a consistent color for each project ID
    const hash = String(projectId)
      .split("")
      .reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);

    return colors[hash % colors.length];
  };

  useEffect(() => {
    const map = getEventIndex(dayEvents);
    setTimeMap(map);
  }, [dayEvents]);

  return (
    <VStack>
      <Heading size="sm">{dateHeader}</Heading>
      <Heading size="lg">{dateNummericHeader}</Heading>
      <Box width="xl" justifyContent="center" alignContent="center">
        {/* Date navigation header */}

        {/* All-day events */}
        {allDayEvents && (
          <Box
            mb={4}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
          >
            <VStack align="stretch" gap={1} p={2}>
              {allDayEvents.map((event) => (
                <Box
                  key={event.task.id}
                  bg={"blue.100"}
                  pl={2}
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ opacity: 0.9 }}
                >
                  <Text fontSize="xs">{event.task.title}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Timeline view */}
        <Box
          overflowY="auto"
          height="600px"
          border="1px solid"
          borderColor="gray.200"
          boxSizing="border-box"
          borderRadius="md"
        >
          <Box width="100%" position="relative" height={TIMELINE_HEIGHT * 24}>
            {/* Current time indicator */}
            {(() => {
              const now = new Date();
              if (now.toDateString() === date.toDateString()) {
                const currentHour = now.getHours() + now.getMinutes() / 60;
                const top = `${(currentHour / 24) * 100 + 100 / 60}%`;
                return (
                  <Box
                    position="absolute"
                    left="0"
                    width="100%"
                    top={top}
                    zIndex={5}
                    pointerEvents="none"
                  >
                    <Flex alignItems="center">
                      <Box
                        width="10px"
                        height="10px"
                        borderRadius="full"
                        bg="red.500"
                        ml={2}
                      />
                      <Box height="1px" bg="red.500" flex="1" />
                    </Flex>
                  </Box>
                );
              }
              return null;
            })()}

            {/* Hour lines */}
            {hours.map((hour) => (
              <HStack
                key={hour}
                padding={4}
                height={TIMELINE_HEIGHT}
                width="100%"
              >
                <Text fontStyle="xs" flexShrink="0">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`}
                </Text>
                <Separator color="gray.700" flex="1" />
              </HStack>
            ))}

            {/* Events */}
            {dayEvents.map((event, idx) => {
              const { top, height } = getEventStyle(event);

              const eventIndex = timeMap.get(event.task.id) || 0;

              const { width, left } = getHorizontalPosition(event, eventIndex);

              const bgColor = event.task.project?.id
                ? getEventColor(event.task.project.id)
                : "pink.300";

              const hoverColor = event.task.project?.id
                ? getEventColor(event.task.project?.id).replace("300", "400")
                : "pink.400";

              return (
                <Box
                  key={event.task.id}
                  position="absolute"
                  left={left}
                  width={width}
                  top={top}
                  height={height}
                  padding={1}
                  cursor="pointer"
                  zIndex={1}
                >
                  <Box
                    bg={bgColor}
                    borderRadius="md"
                    padding={2}
                    height="100%"
                    overflow="hidden"
                    boxShadow="sm"
                    position="relative"
                    _hover={{ boxShadow: "md" }}
                    _before={{
                      content: '""',
                      bg: hoverColor,
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "10px",
                      boxSizing: "border-box",
                      borderRadius: "4px 0 0 4px",
                    }}
                  >
                    <Text fontWeight="medium" fontSize="sm" maxLines={1} ml={2}>
                      {event.task.title}
                    </Text>
                    <Text fontSize="xs" color="gray.600" ml={2}>
                      {new Date(event.task.start_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -
                      {new Date(event.task.end_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </VStack>
  );
};
export default DayView;
