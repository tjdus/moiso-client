import { TaskAssignmentDTO } from "@/lib/api/interface/fetchDTOs";
import { HTMLProps } from "react";
export interface SingleDatepickerProps {
  disabled?: boolean;
  id?: string;
  name?: string;
  configs?: SingleDatepickerConfigs;
  events?: TaskAssignmentDTO[];
  onClickMoreButton: (id: string) => void;
}

export interface SingleDatepickerConfigs {
  dateFormat: string;
  monthNames: string[];
  dayNames: string[];
}

export interface DateObj {
  date: Date;
  nextMonth: boolean;
  prevMonth: boolean;
  selectable: boolean;
  selected: boolean;
  today: boolean;
}

export interface Calendar {
  firstDayOfMonth: Date;
  lastDayOfMonth: Date;
  month: number;
  weeks: Array<Array<DateObj>>;
  year: number;
}

export interface CalendarNavButtonProps extends HTMLProps<HTMLButtonElement> {
  viewMode: "day" | "month" | "year";
  onDateChange: (date: Date) => void;
  date: Date;
}

export interface RenderProps {
  calendar: Calendar;
}
