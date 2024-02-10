import dayjs from "dayjs";

export const ROOT_ID_SELECTOR = import.meta.env.ROOT_ID_SELECTOR as string;
export const API_URL = import.meta.env.VITE_API_URL as string;

export const UTC_OFFSET = dayjs().utcOffset() / 60;

export const initialState = {
  eventsData: {
    allStartEndHoursStream: [],
    eventsByWeekDay: {},
    receivedEvents: [],
  },
  personInfo: {},
};
