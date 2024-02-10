import dayjs from "dayjs";
import { IEvent } from "./types.ts";

export interface ISelectedWeek {
  weekDay: string;
  day: dayjs.Dayjs;
  date: string;
}

export function generateWeekDays(_offsetWeek: number): ISelectedWeek[] {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const days = [];
  const date = dayjs().add(_offsetWeek, "week");

  for (let i = 0; i < 7; i++) {
    const offset = parseInt(date.format("d")) === 0 ? 7 : 0;
    const day = date.weekday(i + 1 - offset);
    days.push({
      weekDay: weekDays[i],
      day,
      date: day.get("month") + 1 + "/" + day.get("date"),
    });
  }

  return days;
}

const hoursNum = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const hoursFull = hoursNum
  .map((a) => a + " AM")
  .concat(hoursNum.map((a) => a + " PM"));

export function generateHours(
  hoursStream: string[],
  isLive: boolean,
): string[] {
  let hours = [];

  if (hoursStream.length > 0 || hoursStream.includes("00:00:00") || isLive) {
    const hourStart = [...hoursStream].sort()[0];
    const hourEnd = [...hoursStream].sort()[hoursStream.length - 1];
    const date = dayjs().format("YYYY-MM-DD");

    const interval = Array.from([hourStart, hourEnd]).sort();

    let indStart = hoursFull.indexOf(
      dayjs(date + " " + interval[0]).format("h A"),
    );
    indStart = indStart > 0 ? indStart - 1 : indStart;

    const indEnd = hoursFull.indexOf(
      dayjs(date + " " + interval[1]).format("h A"),
    );
    hours = hoursFull.slice(indStart, indEnd + 1);
  } else {
    hours = hoursFull;
  }

  return hours;
}

export function getEventsByWeekDay(
  _eventsByWeekDay: Record<string, IEvent[]>,
  _events: IEvent[],
): [Record<string, IEvent[]>, IEvent[]] {
  const extendedEvents: IEvent[] = [];
  _events
    .filter((ev) => !!ev)
    .forEach((ev) => {
      if (dayjs(ev.dateEnd).format("DD") !== dayjs(ev.dateStart).format("DD")) {
        const end =
          dayjs(ev.dateStart).add(1, "day").format("YYYY-MM-DD") + " 00:00:00";
        extendedEvents.push({
          ...ev,
          dateStart: end,
          isStartedYesterday: true,
          duration: dayjs(ev.dateEnd).diff(end, "seconds"),
        });
        ev.dateEnd = dayjs(ev.dateStart).format("YYYY-MM-DD") + " 23:59:59";
        ev.duration = dayjs(ev.dateEnd).diff(ev.dateStart, "seconds");
        ev.notEnded = true;
      }

      const weekDay = dayjs(ev.dateStart).format("M/D");
      _eventsByWeekDay[weekDay] = _eventsByWeekDay[weekDay]
        ? [..._eventsByWeekDay[weekDay], ev]
        : [ev];
    });

  return [_eventsByWeekDay, extendedEvents];
}

export const findActiveHour = (
  dividerHours: number,
  hours: string[],
): string => {
  let activeHour = dayjs().format("h A");
  const indStart = hoursFull.indexOf(activeHour) - dividerHours;
  for (const hour of hours) {
    const curInd = hoursFull.indexOf(hour);

    if (
      !hours.includes(activeHour) &&
      curInd > indStart &&
      curInd < hoursFull.indexOf(activeHour)
    ) {
      for (let i = indStart; i < hoursFull.indexOf(activeHour); i++) {
        if (hours.includes(hoursFull[i])) {
          activeHour = hoursFull[i];
          break;
        }
      }
    }
  }

  return activeHour;
};

export function transformLongEvent(events: IEvent[]) {
  let _eventsByWeekDay: Record<string, IEvent[]> = {};
  let extendedEvents: IEvent[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    [_eventsByWeekDay, extendedEvents] = getEventsByWeekDay(
      _eventsByWeekDay,
      extendedEvents.length ? extendedEvents : events,
    );
    if (!extendedEvents.length) break;
  }

  return _eventsByWeekDay;
}

export function getDivider(hoursContainerWidth: number) {
  if (hoursContainerWidth < 1000) return 3;
  else if (hoursContainerWidth < 1600) return 2;
  return 1;
}
