import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekday from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  IAppInitData,
  IEvent,
  IEventsWidth,
  IModalEvent,
  IPersonInfo,
  ISelectedWeek,
} from "../../types.ts";
import useWindowResize from "../../hooks/useWindowResize.ts";
import { generateHours, getDivider } from "../../utils.ts";
import "./styles.scss";
import OpenedEvent from "../OpenedEvent/OpenedEvent.tsx";
import Hours from "../Hours/Hours.tsx";
import { Event } from "../Event/Event.tsx";
import { IEventsByWeek } from "../../store/common.api.v1.ts";

dayjs.extend(weekday);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

interface ScheduleContainerProps {
  appInitData: IAppInitData;
  eventsData: IEventsByWeek;
  selectedWeek: ISelectedWeek[];
  personInfo?: IPersonInfo;
}

const ScheduleContainer: FC<ScheduleContainerProps> = ({
  appInitData,
  eventsData,
  selectedWeek,
  personInfo,
}) => {
  const { eventsByWeekDay, allStartEndHoursStream } = eventsData;
  const isCurrentWeek = true;
  const activeWeekDay = parseInt(dayjs().format("d"));

  const [displayedHours, setDisplayedHours] = useState<string[]>([]);

  const { width } = useWindowResize();

  function getActiveClass(index: number, value: number) {
    return isCurrentWeek && index == (value || 7) - 1 ? "active" : "";
  }

  useEffect(() => {
    onResize();
  }, [width, allStartEndHoursStream]);

  const hoursContainerWidth =
    document.getElementById(appInitData.rootIdSelector)?.offsetWidth || 500;

  const [eventsWidthState, setEventsWidthState] = useState<IEventsWidth>({});

  function onResize() {
    const hoursResult = generateHours(
      allStartEndHoursStream,
      isCurrentWeek && !!personInfo?.personIsLive,
    );
    let divider = 1;

    const anyDate = dayjs().format("YYYY-MM-DD");
    if (hoursResult.length > 5) {
      divider = getDivider(hoursContainerWidth);
    }

    const _displayedHours = hoursResult.filter(
      (hour) => parseInt(hour.split(" ")[0]) % divider === 0,
    );
    setDisplayedHours(_displayedHours);

    const timeStart = dayjs(anyDate + " " + _displayedHours[0], "YYYY-MM-DD h A");
    const timeEnd = dayjs(
      anyDate + " " + _displayedHours[_displayedHours.length - 1],
      "YYYY-MM-DD h A",
    );

    const minutes = (timeEnd.diff(timeStart, "hours") + divider) * 60; //;
    const gmtBlockWidth = 70;
    const pixInMinute = (hoursContainerWidth - gmtBlockWidth) / minutes;

    const resizeEvents = Object.values(eventsByWeekDay).flat();

    const eventsWidth: IEventsWidth = {};
    resizeEvents.map((event) => {
      const ev = { ...event };
      if (ev.dateStart) {
        const timeStartDay = dayjs(
          ev.dateStart.slice(0, 11) + _displayedHours[0],
          "YYYY-MM-DD h A",
        );
        const timeStartEvent = dayjs(ev.dateStart);
        eventsWidth[ev.dateStart] = {
          marginLeft: pixInMinute * timeStartEvent.diff(timeStartDay, "minute"),
          width: (pixInMinute * ev.duration) / 60, // minutes
        };
      }
    });
    setEventsWidthState(eventsWidth);
  }

  console.log("eventsByWeekDay", eventsData?.eventsByWeekDay, eventsWidthState);

  const [selectedEvent, setSelectEvent] = useState<IModalEvent | null>(null);

  function closeEventModal() {
    setSelectEvent(null);
  }

  function selectEvent(event: IEvent) {
    setSelectEvent({
      ...event,
      ...appInitData,
    });
  }

  return (
    <div>
      <Hours
        displayedHours={displayedHours}
        isCurrentWeek={isCurrentWeek}
        hoursContainerWidth={hoursContainerWidth}
      />
      <div className="stream-schedule">
        <div className="stream-schedule-week week-td">
          {selectedWeek.map((day, index) => (
            <div
              key={index + day.date}
              className={`weekday ${getActiveClass(index, activeWeekDay)}`}
            >
              {day.weekDay}
              <br />
              {day.date}
            </div>
          ))}
        </div>

        <div className="stream-schedule__events">
          {selectedWeek.map((day, index) => (
            <div
              key={"stream-schedule-day_" + index}
              className={"stream-schedule-day " + getActiveClass(index, activeWeekDay)}
            >
              {eventsByWeekDay[day.date] &&
                Object.keys(eventsWidthState).length > 0 &&
                !!personInfo &&
                eventsByWeekDay[day.date].map((event) => (
                  <Event
                    event={event}
                    key={event.id + (event.startTime || "")}
                    eventsWidth={eventsWidthState}
                    personInfo={personInfo}
                    handleSelectEvent={selectEvent}
                    selectedEventKey={
                      selectedEvent ? selectedEvent.contentId + selectedEvent.type : ""
                    }
                  />
                ))}
            </div>
          ))}
        </div>

        {selectedEvent && personInfo && (
          <OpenedEvent event={selectedEvent} closeModal={closeEventModal} personInfo={personInfo} />
        )}
      </div>
    </div>
  );
};

export default ScheduleContainer;
