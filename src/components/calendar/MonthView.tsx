"use client";

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Input,
  Popover,
  Portal,
  Separator,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { formatDateKST, isDateInRange, isEqual } from "@/lib/util/dateFormat";
import { TaskAssignmentDTO } from "@/lib/api/interface/fetchDTOs";
import { useState, useEffect } from "react";
import { Calendar, DateObj, RenderProps, SingleDatepickerConfigs } from "./d";
import { getMyTaskAssignmentList } from "@/lib/api/getApi";

interface EventBarProps {
  event: TaskAssignmentDTO;
  date: Date;
  onClickMoreButton: (id: string) => void;
}

const EventBar: React.FC<EventBarProps> = (props) => {
  const { event, date, onClickMoreButton } = props;

  const startDate = new Date(event.task.start_at);
  const endDate = new Date(event.task.end_at);
  const isStartDate = startDate.getDate() === date.getDate();
  const isEndDate = endDate.getDate() === date.getDate();
  const blockRadius =
    isStartDate && isEndDate
      ? "4px"
      : isStartDate
      ? "4px 0 0 4px"
      : isEndDate
      ? "0 4px 4px 0"
      : "0";

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

  const bgColor = event.task.project?.id
    ? getEventColor(event.task.project.id)
    : "pink.300";

  const hoverColor = event.task.project?.id
    ? getEventColor(event.task.project?.id).replace("300", "400")
    : "pink.400";

  // Format dates for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Box
          bg={bgColor}
          width="100%"
          height="4"
          borderRadius={blockRadius}
          border="1px solid"
          borderColor={bgColor}
          boxSizing="content-box"
          cursor="pointer"
          transition="all 0.2s ease-in-out"
          _hover={{
            bg: hoverColor,
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            transform: "translateY(-1px)",
          }}
          position="relative"
          _before={
            isStartDate
              ? {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "10px",
                  bg: hoverColor,
                  borderRadius: "4px 0 0 4px",
                }
              : undefined
          }
        >
          {isStartDate && (
            <Text textStyle="xs" fontWeight="medium" px="1">
              {event.task.title}
            </Text>
          )}
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="300px">
            <Popover.Body p="0">
              <Card.Root>
                <Box p="4" borderTopRadius="md" bg={bgColor} color="white">
                  <HStack mb="1">
                    {event.task.project && (
                      <Badge bg="whiteAlpha.300" px="2" fontSize="xs">
                        {event.task.project.name}
                      </Badge>
                    )}
                  </HStack>
                  <Popover.Title fontWeight="semibold" fontSize="lg">
                    {event.task.title}
                  </Popover.Title>
                </Box>

                <Box p="4">
                  {event.task.description && (
                    <Text mb="4" color="gray.700">
                      {event.task.description}
                    </Text>
                  )}

                  <VStack gap="2" align="flex-start">
                    <Flex gap="2" align="center">
                      <Text fontSize="sm" color="gray.600">
                        {formatDateKST({ dateString: event.task.start_at })}
                        {formatDateKST({ dateString: event.task.start_at }) !==
                          formatDateKST({ dateString: event.task.end_at }) &&
                          ` - ${formatDisplayDate(event.task.end_at)}`}
                      </Text>
                    </Flex>
                  </VStack>

                  <HStack mt="4" justify="flex-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onClickMoreButton(event.task.id)}
                    >
                      자세히
                    </Button>
                  </HStack>
                </Box>
              </Card.Root>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

interface MonthViewProps {
  events: TaskAssignmentDTO[];
  date: Date;
  configs: SingleDatepickerConfigs;
  onClickMoreButton: (id: string) => void;
}
const MonthView = (props: MonthViewProps) => {
  const { events, configs, date, onClickMoreButton } = props;
  const [calendar, setCalendar] = useState<Calendar>();
  const [rowMap, setRowMap] = useState<Map<string, Array<string>>>(new Map());

  // Function to generate calendar data for a specific month
  const generateCalendar = (date: Date, selectedDate: Date): Calendar => {
    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfMonth = endOfMonth(date);
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weeks: DateObj[][] = [];

    let currentWeek: DateObj[] = [];

    days.forEach((day) => {
      const dateObj: DateObj = {
        date: day,
        // Check if day is in previous month (before current month)
        prevMonth:
          day.getMonth() < date.getMonth() ||
          (day.getMonth() === 11 && date.getMonth() === 0),
        // Check if day is in next month (after current month)
        nextMonth:
          day.getMonth() > date.getMonth() ||
          (day.getMonth() === 0 && date.getMonth() === 11),
        selectable: true,
        selected: isSameDay(day, selectedDate),
        today: isToday(day),
      };

      currentWeek.push(dateObj);

      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return {
      firstDayOfMonth: startOfMonth(date),
      lastDayOfMonth: endOfMonth(date),
      month: date.getMonth(),
      year: date.getFullYear(),
      weeks,
    };
  };

  const getWeekRowMap = async ({
    events,
    week,
  }: {
    events: TaskAssignmentDTO[];
    week: (DateObj | "")[];
  }) => {
    // date: {index, event id}
    const rowMap = new Map<string, Array<string>>();

    events.sort((a, b) => {
      const startA = new Date(a.task.start_at).getTime();
      const startB = new Date(b.task.start_at).getTime();
      return startA - startB;
    });

    // Initialize rowMap with empty arrays for each date
    week.forEach((dateObj) => {
      if (dateObj === "") return;
      const dateStr = dateObj.date.toISOString().split("T")[0];
      if (!rowMap.has(dateStr)) {
        rowMap.set(dateStr, []);
      }
    });

    // Process all events in parallel
    await Promise.all(
      week.map(async (dateObj) => {
        if (dateObj === "") return;
        const dateStr = dateObj.date.toISOString().split("T")[0];

        // Process all events for this date in parallel
        const matchingEvents = await Promise.all(
          events.map(async (event) => {
            const isInRange = await isDateInRange(
              dateObj.date,
              event.task.start_at,
              event.task.end_at
            );
            return isInRange ? event : null;
          })
        );

        // Filter out null values and process the matching events
        const filteredEvents = matchingEvents.filter(
          Boolean
        ) as TaskAssignmentDTO[];

        for (const event of filteredEvents) {
          // Check if the event has already been assigned a row in a previous date
          let row = -1;
          const prevDateStr = new Date(dateObj.date);
          prevDateStr.setDate(prevDateStr.getDate() - 1);
          const prevDateStrFormatted = prevDateStr.toISOString().split("T")[0];

          if (
            rowMap.has(prevDateStrFormatted) &&
            rowMap.get(prevDateStrFormatted)!.includes(event.task.id)
          ) {
            row = rowMap.get(prevDateStrFormatted)!.indexOf(event.task.id)!;
          }

          if (row === -1) {
            row = 0;
            const dateArray = rowMap.get(dateStr);
            if (dateArray) {
              dateArray.push(event.task.id);
            }
          } else {
            rowMap.get(dateStr)![row] = event.task.id;
          }
        }
      })
    );

    return rowMap;
  };

  useEffect(() => {
    const updateCalendar = async () => {
      const newCalendar = generateCalendar(date, date);
      setCalendar(newCalendar);
    };

    updateCalendar();
  }, [events, date]);

  useEffect(() => {
    const fetchRowMap = async () => {
      if (calendar) {
        const newRowMap = await getWeekRowMap({
          events,
          week: calendar.weeks.flat(),
        });
        setRowMap(newRowMap);
      }
    };

    fetchRowMap();
  }, [events, calendar]);

  if (!calendar) {
    return null;
  }

  return (
    <SimpleGrid columns={7} textAlign="center">
      {configs.dayNames.map((day) => (
        <Box key={`${calendar.month}${calendar.year}${day}`}>
          <Text fontSize="lg" fontWeight="medium">
            {day}
          </Text>
        </Box>
      ))}

      {calendar.weeks.map((week, weekIndex) => {
        return week.map((dateObj: DateObj, index) => {
          const {
            date,
            today,
            // prevMonth,
            // nextMonth,
            selected,
          } = dateObj;
          const key = `${calendar.month}${calendar.year}${weekIndex}${index}`;
          const dateStr = date.toISOString().split("T")[0];

          return (
            <Box
              key={key}
              width="120px"
              height="120px"
              border="1px solid"
              borderColor="gray.200"
              alignItems="center"
              justifyContent="center"
            >
              <VStack>
                {date.getDate()}
                <Grid
                  templateRows="repeat(4, 1fr)"
                  gap={1}
                  mt={1}
                  height="80%"
                  width="100%"
                  alignItems="center"
                >
                  {rowMap
                    .get(dateStr)
                    ?.slice(0, 3)
                    .map((eventId, index) => {
                      const event = events.find((e) => e.task.id === eventId);
                      if (!event) return null;

                      return (
                        <GridItem
                          key={event.task.id}
                          rowStart={index + 1}
                          w="100%"
                        >
                          <EventBar
                            date={date}
                            event={event}
                            onClickMoreButton={onClickMoreButton}
                          />
                        </GridItem>
                      );
                    })}
                  {rowMap.get(dateStr) && rowMap.get(dateStr)!.length > 3 && (
                    <GridItem rowStart={5} w="100%" textAlign="center">
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        fontWeight="medium"
                        borderRadius="md"
                        bg="gray.100"
                        px={1}
                      >
                        +{rowMap.get(dateStr)!.length - 3} more
                      </Text>
                    </GridItem>
                  )}
                </Grid>
              </VStack>
            </Box>
          );
        });
      })}
    </SimpleGrid>
  );
};

export default MonthView;
