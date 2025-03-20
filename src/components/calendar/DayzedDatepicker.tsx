"use client";

import React, { Fragment, useRef, useState, ReactNode, useEffect } from "react";
import lodash_isEmpty from "lodash/isEmpty";
import lodash_map from "lodash/map";
import lodash_isNil from "lodash/isNil";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  Separator,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  DateObj,
  useDayzed,
  RenderProps,
  GetBackForwardPropsOptions,
  Calendar,
} from "dayzed";
import { TaskAssignmentDTO } from "@/lib/api/interface/fetchDTOs";
import EventBar from "./MonthView";
import { isDateInRange } from "@/lib/util/dateFormat";
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";

const MONTH_NAMES_DEFAULT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_NAMES_DEFAULT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DATE_FORMAT_DEFAULT = "yyyy-MM-dd";

interface SingleDatepickerBackButtonsProps {
  calendars: Calendar[];
  getBackProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
}

interface SingleDatepickerForwardButtonsProps {
  calendars: Calendar[];
  getForwardProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
}

export interface SingleDatepickerProps {
  disabled?: boolean;
  onDateChange: (date: Date) => void;
  id?: string;
  name?: string;
  date: Date;
  configs?: SingleDatepickerConfigs;
  tasks?: TaskAssignmentDTO[];
  onClickMoreButton: (id: string) => void;
}

export interface SingleDatepickerConfigs {
  dateFormat: string;
  monthNames: string[];
  dayNames: string[];
}

const SingleDatepickerBackButtons = (
  props: SingleDatepickerBackButtonsProps
) => {
  const { calendars, getBackProps } = props;
  return (
    <Fragment>
      <IconButton
        {...getBackProps({ calendars })}
        variant="ghost"
        borderRadius="full"
        size="md"
        _hover={{ bg: "gray.200" }}
      >
        <LuChevronLeft />
      </IconButton>
    </Fragment>
  );
};

const SingleDatepickerForwardButtons = (
  props: SingleDatepickerForwardButtonsProps
) => {
  const { calendars, getForwardProps } = props;
  return (
    <Fragment>
      <IconButton
        {...getForwardProps({
          calendars,
          offset: 12,
        })}
        variant="ghost"
        size="sm"
        borderRadius="full"
        _hover={{ bg: "gray.200" }}
      >
        <LuChevronRight />
      </IconButton>
    </Fragment>
  );
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

      if (dateStr === "2025-03-14") {
        console.log("Processing events for March 14, 2025");
        console.log(filteredEvents);
      }

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

        // If the event was not assigned a row in a previous date, find a new row
        if (dateStr === "2025-03-13") {
          console.log("Processing events for March 13, 2025");
          console.log(event.task.title, row);
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
const SingleDatepickerCalendar = (
  props: RenderProps & {
    configs: SingleDatepickerConfigs;
    events: TaskAssignmentDTO[];
    onClickMoreButton: (id: string) => void;
  }
) => {
  const {
    calendars,
    getDateProps,
    getBackProps,
    getForwardProps,
    configs,
    events,
    onClickMoreButton,
  } = props;
  const [rowMap, setRowMap] = useState<Map<string, Array<string>>>(new Map());

  useEffect(() => {
    if (lodash_isEmpty(calendars) || lodash_isEmpty(events)) return;

    const processAllWeeks = async () => {
      // Collect all weeks from all calendars
      const allWeeks = calendars.flatMap((calendar) => calendar.weeks);

      // Create a master row map
      const masterRowMap = new Map<string, Array<string>>();

      // Process all weeks in parallel
      await Promise.all(
        allWeeks.map(async (week) => {
          const weekRowMap = await getWeekRowMap({ events, week });

          // Merge week row map into master map
          weekRowMap.forEach((eventIds, dateStr) => {
            masterRowMap.set(dateStr, eventIds);
          });
        })
      );

      setRowMap(masterRowMap);
    };

    processAllWeeks();
  }, [calendars, events]);

  if (lodash_isEmpty(calendars)) {
    return null;
  }
  return (
    <HStack className="datepicker-calendar" width="100%" height="100%">
      {lodash_map(calendars, (calendar) => {
        return (
          <VStack
            key={`${calendar.month}${calendar.year}`}
            width="full"
            height="full"
          >
            <HStack>
              <SingleDatepickerBackButtons
                calendars={calendars}
                getBackProps={getBackProps}
              />
              <Heading size="xl" textAlign="center">
                {configs.monthNames[calendar.month]} {calendar.year}
              </Heading>
              <SingleDatepickerForwardButtons
                calendars={calendars}
                getForwardProps={getForwardProps}
              />
            </HStack>
            <Separator />
            <SimpleGrid columns={7} textAlign="center">
              {lodash_map(configs.dayNames, (day) => (
                <Box key={`${calendar.month}${calendar.year}${day}`}>
                  <Text fontSize="lg" fontWeight="medium">
                    {day}
                  </Text>
                </Box>
              ))}
              {lodash_map(calendar.weeks, (week, weekIndex) => {
                return lodash_map(week, (dateObj: DateObj, index) => {
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
                      {...getDateProps({
                        dateObj,
                        // disabled: isDisabled
                      })}
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
                              const event = events.find(
                                (e) => e.task.id === eventId
                              );
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
                          {rowMap.get(dateStr) &&
                            rowMap.get(dateStr)!.length > 3 && (
                              <GridItem
                                rowStart={5}
                                w="100%"
                                textAlign="center"
                              >
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
          </VStack>
        );
      })}
    </HStack>
  );
};

export const EventCalendar: React.FC<SingleDatepickerProps> = ({
  configs = {
    dateFormat: DATE_FORMAT_DEFAULT,
    monthNames: MONTH_NAMES_DEFAULT,
    dayNames: DAY_NAMES_DEFAULT,
  },
  ...props
}) => {
  const { date, name, disabled, onDateChange, id, tasks: events } = props;

  const ref = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  function useOutsideClick(
    ref: React.RefObject<HTMLElement | null>,
    handler: () => void
  ): void {
    React.useEffect(() => {
      const listener = (event: MouseEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
        handler();
      };
      document.addEventListener("mousedown", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
      };
    }, [ref, handler]);
  }

  useOutsideClick(ref, () => setPopoverOpen(false));

  const onDateSelected = (options: { selectable: boolean; date: Date }) => {
    const { selectable, date } = options;
    if (!selectable) return;
    if (!lodash_isNil(date)) {
      onDateChange(date);
      setPopoverOpen(false);
      return;
    }
  };

  const dayzedData = useDayzed({
    showOutsideDays: true,
    onDateSelected,
    selected: date,
  });

  return (
    <SingleDatepickerCalendar
      {...dayzedData}
      configs={configs}
      events={events || []}
      {...props}
    />
  );
};
