"use client";

import React, { Fragment, useRef, useState, ReactNode, useEffect } from "react";
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
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { TaskAssignmentDTO } from "@/lib/api/interface/fetchDTOs";
import { isDateInRange } from "@/lib/util/dateFormat";
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";
import {
  Calendar,
  CalendarNavButtonProps,
  DateObj,
  RenderProps,
  SingleDatepickerConfigs,
  SingleDatepickerProps,
} from "./d";
import MonthView from "./MonthView";
import DayView from "./DayView";
import { on } from "events";
import { set } from "lodash";
import { getMyTaskAssignmentList } from "@/lib/api/getApi";

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

const SingleDatepickerBackButtons = (props: CalendarNavButtonProps) => {
  const { date, onDateChange, viewMode } = props;
  const handleClick = () => {
    if (viewMode === "day") {
      onDateChange(new Date(date.setDate(date.getDate() - 1)));
    } else if (viewMode === "month") {
      onDateChange(
        new Date(date.setFullYear(date.getFullYear(), date.getMonth() - 1, 1))
      );
    } else if (viewMode === "year") {
      onDateChange(
        new Date(date.setFullYear(date.getFullYear() - 1, date.getMonth(), 1))
      );
    }
  };

  return (
    <Fragment>
      <IconButton
        onClick={handleClick}
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

const SingleDatepickerForwardButtons = (props: CalendarNavButtonProps) => {
  const { date, onDateChange, viewMode } = props;
  const handleClick = () => {
    if (viewMode === "day") {
      onDateChange(new Date(date.setDate(date.getDate() + 1)));
    } else if (viewMode === "month") {
      onDateChange(
        new Date(date.setFullYear(date.getFullYear(), date.getMonth() + 1, 1))
      );
    } else if (viewMode === "year") {
      onDateChange(
        new Date(date.setFullYear(date.getFullYear() + 1, date.getMonth(), 1))
      );
    }
  };
  return (
    <Fragment>
      <IconButton
        onClick={handleClick}
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

const SingleDatepickerCalendar = (props: {
  events: TaskAssignmentDTO[];
  configs: SingleDatepickerConfigs;
  onClickMoreButton: (id: string) => void;
}) => {
  const { events, configs, onClickMoreButton } = props;

  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("day");
  const [date, setDate] = useState<Date>(new Date());

  return (
    <HStack className="datepicker-calendar" width="100%" height="100%">
      <VStack
        key={`${date.getMonth()}${date.getFullYear()}`}
        width="full"
        height="full"
      >
        {/* Header */}
        <HStack>
          <SingleDatepickerBackButtons
            viewMode={viewMode}
            onDateChange={setDate}
            date={date}
          />
          <Heading size="xl" textAlign="center">
            {configs.monthNames[date.getMonth()]} {date.getFullYear()}
          </Heading>
          <SingleDatepickerForwardButtons
            viewMode={viewMode}
            onDateChange={setDate}
            date={date}
          />
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="outline" size="sm">
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="month" onClick={() => setViewMode("month")}>
                Month
              </MenuItem>
              <MenuItem value="day" onClick={() => setViewMode("day")}>
                Day
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </HStack>
        <Separator />

        {/* Contents */}

        <Tabs.Root value={viewMode} size="lg">
          <Tabs.Content value="day">
            <DayView date={date} {...props} />
          </Tabs.Content>
          <Tabs.Content value="month">
            <MonthView date={date} {...props} />
          </Tabs.Content>
          <Tabs.Content value="week"></Tabs.Content>
        </Tabs.Root>
      </VStack>
    </HStack>
  );
};

export const CalendarTabs: React.FC<SingleDatepickerProps> = ({
  configs = {
    dateFormat: DATE_FORMAT_DEFAULT,
    monthNames: MONTH_NAMES_DEFAULT,
    dayNames: DAY_NAMES_DEFAULT,
  },
  ...props
}) => {
  const { name, disabled, id, events } = props;

  if (!events) {
    return null;
  }

  return (
    <SingleDatepickerCalendar
      events={events}
      configs={configs}
      onClickMoreButton={() => {}}
    />
  );
};
