"use client";

import React, { Fragment, useRef, useState, ReactNode } from "react";
import lodash_isEmpty from "lodash/isEmpty";
import lodash_map from "lodash/map";
import lodash_isNil from "lodash/isNil";
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Separator,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover";
import { Input as InputComponent } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { LuCalendar } from "react-icons/lu";

import {
  DateObj,
  useDayzed,
  RenderProps,
  GetBackForwardPropsOptions,
  Calendar,
} from "dayzed";
import { format } from "date-fns";
import TimePicker from "../custom-ui/TimePicker";

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
      <Button
        {...getBackProps({
          calendars,
          offset: 12,
        })}
        variant="ghost"
        size="sm"
      >
        {"<<"}
      </Button>
      <Button {...getBackProps({ calendars })} variant="ghost" size="sm">
        {"<"}
      </Button>
    </Fragment>
  );
};

const SingleDatepickerForwardButtons = (
  props: SingleDatepickerForwardButtonsProps
) => {
  const { calendars, getForwardProps } = props;
  return (
    <Fragment>
      <Button {...getForwardProps({ calendars })} variant="ghost" size="sm">
        {">"}
      </Button>
      <Button
        {...getForwardProps({
          calendars,
          offset: 12,
        })}
        variant="ghost"
        size="sm"
      >
        {">>"}
      </Button>
    </Fragment>
  );
};

const SingleDatepickerCalendar = (
  props: RenderProps & {
    configs: SingleDatepickerConfigs;
    onDateClick: (dateObj: DateObj) => void;
  }
) => {
  const {
    calendars,
    getDateProps,
    getBackProps,
    getForwardProps,
    configs,
    onDateClick,
  } = props;

  if (lodash_isEmpty(calendars)) {
    return null;
  }

  return (
    <HStack className="datepicker-calendar">
      {lodash_map(calendars, (calendar) => {
        return (
          <VStack key={`${calendar.month}${calendar.year}`}>
            <HStack>
              <SingleDatepickerBackButtons
                calendars={calendars}
                getBackProps={getBackProps}
              />
              <Heading size="sm" textAlign="center">
                {configs.monthNames[calendar.month]} {calendar.year}
              </Heading>
              <SingleDatepickerForwardButtons
                calendars={calendars}
                getForwardProps={getForwardProps}
              />
            </HStack>
            <Separator />
            <SimpleGrid columns={7} gap={2} textAlign="center">
              {lodash_map(configs.dayNames, (day) => (
                <Box key={`${calendar.month}${calendar.year}${day}`}>
                  <Text fontSize="sm" fontWeight="semibold">
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

                  return (
                    <Button
                      {...getDateProps({
                        dateObj,
                        // disabled: isDisabled
                      })}
                      key={key}
                      size="sm"
                      variant="outline"
                      borderColor={today ? "purple.400" : "transparent"}
                      bg={selected ? "purple.200" : undefined}
                      onClick={() => onDateClick(dateObj)}
                    >
                      {date.getDate()}
                    </Button>
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

export const SingleDateTimepicker: React.FC<SingleDatepickerProps> = ({
  configs = {
    dateFormat: DATE_FORMAT_DEFAULT,
    monthNames: MONTH_NAMES_DEFAULT,
    dayNames: DAY_NAMES_DEFAULT,
  },
  ...props
}) => {
  const { date, name, disabled, onDateChange, id } = props;

  const ref = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
      setTimePickerOpen(true);
      setSelectedDate(date);
      return;
    }
  };

  const dayzedData = useDayzed({
    showOutsideDays: true,
    onDateSelected,
    selected: date,
  });

  const handleDateClick = (dateObj: DateObj) => {
    if (dateObj.selectable) {
      onDateChange(dateObj.date);
      setTimePickerOpen(true);
      setSelectedDate(dateObj.date);
    }
  };

  const handleTimeChange = (time: { hours: number; minutes: number }) => {
    if (date) {
      date.setHours(time.hours);
      date.setMinutes(time.minutes);
      onDateChange(date);
      console.log("date", date);
    }
  };

  return (
    <>
      <PopoverRoot
        positioning={{ placement: "bottom-start" }}
        open={popoverOpen}
        onOpenChange={(e) => setPopoverOpen(e.open)}
        initialFocusEl={() => initialFocusRef.current}
        lazyMount
        unmountOnExit
      >
        <PopoverTrigger>
          <InputGroup endElement={<LuCalendar />}>
            <InputComponent
              id={id}
              autoComplete="off"
              background="white"
              disabled={disabled}
              ref={initialFocusRef}
              onClick={() => setPopoverOpen(!popoverOpen)}
              name={name}
              value={format(date, `${configs.dateFormat} HH:mm`)}
              onChange={(e) => e.target.value}
            />
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent ref={ref}>
          <PopoverBody
            padding={"10px 5px"}
            borderWidth={1}
            borderColor="blue.400"
          >
            <PopoverRoot
              positioning={{ placement: "right" }}
              open={timePickerOpen}
              onOpenChange={(e) => setTimePickerOpen(e.open)}
              lazyMount
              unmountOnExit
            >
              <HStack>
                <SingleDatepickerCalendar
                  {...dayzedData}
                  configs={configs}
                  onDateClick={handleDateClick}
                />
                <PopoverTrigger></PopoverTrigger>
              </HStack>

              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                  <TimePicker
                    onClose={() => setTimePickerOpen(false)}
                    onTimeChange={handleTimeChange}
                  />
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </>
  );
};
