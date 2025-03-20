"use client";

import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  CalendarEvent,
  CalendarEventExternal,
  CalendarType,
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid,
} from "@schedule-x/calendar";
import { mergeLocales, translations } from "@schedule-x/translations";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { getProjectCalendarConfig, DEFAULT_CALENDAR_CONFIG } from "./config";
import { createEventModalPlugin } from "@schedule-x/event-modal";

import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import "./calendar.css";
import {
  getMyProjectMemberList,
  getMyTaskAssignmentList,
} from "@/lib/api/getApi";
import { formatDateTimeKST } from "@/lib/util/dateFormat";
import {
  ProjectMemberDTO,
  TaskAssignmentDTO,
} from "@/lib/api/interface/fetchDTOs";
import { Card, Dialog, Tabs, useDisclosure } from "@chakra-ui/react";
import TaskDetailDialog, {
  useTaskDetailDialog,
} from "../dialog/TaskDetail/TaskDetailDialog";
import { Button, Input, Popover, Portal, Text } from "@chakra-ui/react";
import { set } from "lodash";
import TaskDetails from "../dialog/TaskDetail/TaskDetails";
import TaskAssignTable from "../dialog/TaskDetail/TaskAssignTable";
import MyTaskAssignments from "../dialog/TaskDetail/MyTaskAssignments";

interface Event {
  id: string;
  start: string;
  end: string;
  title: string;
  description: string;
  calendarId: string;
}

const CustomEventModal = ({
  calendarEvent,
}: {
  calendarEvent: CalendarEvent;
}) => {
  const taskId = calendarEvent.id.toString();

  return (
    <Card.Root>
      <Card.Body>
        <Tabs.Root variant="outline" border="1px" defaultValue="details">
          <Tabs.List gap={1}>
            <Tabs.Trigger padding={2} value="details">
              Details
            </Tabs.Trigger>
            <Tabs.Trigger padding={2} value="assignees">
              Assignees
            </Tabs.Trigger>
            <Tabs.Trigger padding={2} value="my">
              My
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content
            value="details"
            children={<TaskDetails taskId={taskId} />}
          ></Tabs.Content>
          <Tabs.Content
            value="assignees"
            children={<TaskAssignTable taskId={taskId} />}
          ></Tabs.Content>
          <Tabs.Content value="my">
            <MyTaskAssignments taskId={taskId} />
          </Tabs.Content>
        </Tabs.Root>
      </Card.Body>
    </Card.Root>
  );
};

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);
  const [projectCalendars, setProjectCalendars] = useState<Record<string, any>>(
    {}
  );
  const { setTaskId, setOpen } = useTaskDetailDialog();
  const eventModal = createEventModalPlugin();

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const [eventsResponse, projectsResponse] = await Promise.all([
          getMyTaskAssignmentList({}),
          getMyProjectMemberList({}),
        ]);

        // Process events
        const events = eventsResponse.data.results.map(
          (taskAssignment: TaskAssignmentDTO) => ({
            id: taskAssignment.task.id.toString(),
            title: taskAssignment.task.title,
            start: formatDateTimeKST({
              dateString: taskAssignment.task.start_at,
            }),
            end: formatDateTimeKST({ dateString: taskAssignment.task.end_at }),
            description: taskAssignment.task.description,
            calendarId: taskAssignment.task.project.id.toString(),
          })
        );
        setCalendarEvents(events);

        // Process calendars/projects with randomized colors based on project ID
        const calendars: Record<string, any> = {};
        projectsResponse.data.results.forEach((projectMember: any) => {
          const projectId = projectMember.project.id.toString();
          calendars[projectId] = getProjectCalendarConfig(projectId);
        });
        setProjectCalendars(calendars);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchCalendarData();
  }, []);

  const calendar = createCalendar({
    locale: "ko-KR",
    translations: mergeLocales(translations, {
      koKR: {
        Week: "일주일",
      },
    }),
    defaultView: viewMonthGrid.name,
    calendars:
      Object.keys(projectCalendars).length > 0
        ? projectCalendars
        : { default: DEFAULT_CALENDAR_CONFIG },
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: calendarEvents,
    plugins: [eventsService, eventModal],
    callbacks: {
      onRender: () => {
        eventsService.getAll();
      },
      onEventClick: (event) => {
        setTaskId(event.id.toString());
        setOpen(true);
      },
    },
  });

  return (
    <div>
      <ScheduleXCalendar
        calendarApp={calendar}
        customComponents={{
          eventModal: TaskDetailDialog,
        }}
      />
      <TaskDetailDialog />
    </div>
  );
}

export default CalendarApp;
