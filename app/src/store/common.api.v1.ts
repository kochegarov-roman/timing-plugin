import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IEvent, IPersonInfo } from "../types";
import { API_URL, UTC_OFFSET } from "../constants.ts";
import dayjs from "dayjs";
import { transformLongEvent } from "../utils.ts";
import { createEventOnCurrentWeek } from "../mock/mock-events.ts";

export interface IEventsByWeek {
  allStartEndHoursStream: string[];
  eventsByWeekDay: Record<string, IEvent[]>;
  receivedEvents: IEvent[];
}

const transformEventsResponse = (events: IEvent[]): IEventsByWeek => {
  // set 5 events on current week for test
  let transformedEvents = createEventOnCurrentWeek(events);
  transformedEvents = [...transformedEvents].map((ev: IEvent) => {
    ev = { ...ev };
    ev.dateStart = dayjs(ev.createdAt)
      .add(UTC_OFFSET, "hours")
      .format("YYYY-MM-DD HH:mm:ss");
    ev.weekDay = parseInt(dayjs(ev.dateStart).format("d"));
    ev.dateEnd = dayjs(ev.dateStart)
      .add(ev.duration, "second")
      .format("YYYY-MM-DD HH:mm:ss");
    ev.date = dayjs(ev.dateStart).fromNow();
    ev.startDateLong = dayjs(ev.dateStart).format("dddd, MMM D, YYYY");
    ev.startTime = dayjs(ev.dateStart).format("hh:mm A");
    ev.endTime = dayjs(ev.dateEnd).format("hh:mm A");
    ev.marginLeft = 0;
    ev.width = 0;
    ev.durationTime = new Date(ev.duration * 1000)
      .toISOString()
      .substring(11, 19);

    return ev;
  });

  const eventsByWeekDay = transformLongEvent(transformedEvents);
  const activeWeekDay = parseInt(dayjs().format("d"));

  const hoursStream: string[] = [];
  // get hours
  Object.keys(eventsByWeekDay).forEach((day) => {
    if (eventsByWeekDay[day])
      eventsByWeekDay[day].forEach((ev) => {
        if (ev.dateStart && ev.dateEnd) {
          hoursStream.push(ev.dateStart.slice(11, 19));
          hoursStream.push(ev.dateEnd.slice(11, 19));
          if (ev.isLive && ev.weekDay && ev.weekDay < activeWeekDay)
            hoursStream.push("00:00:00");
        }
      });
  });

  return {
    allStartEndHoursStream: hoursStream,
    eventsByWeekDay,
    receivedEvents: transformedEvents,
  };
};

export const commonAPI = createApi({
  reducerPath: "commonAPI",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    fetchEvents: builder.query<
      IEventsByWeek,
      { created_from: string; created_to: string }
    >({
      query: (params) =>
        `/events?created_from=${params.created_from}&created_to=${params.created_to}`,
      transformResponse: (response: IEvent[]) =>
        transformEventsResponse(response),
    }),
    fetchPersonInfoById: builder.query<IPersonInfo, string>({
      query: (personId) => `/persons/${personId}`,
    }),
  }),
  refetchOnMountOrArgChange: false,
});

export const { useFetchEventsQuery, useFetchPersonInfoByIdQuery } = commonAPI;
