import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekday from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IAppInitData, IEvent, IModalEvent, IPersonInfo } from "../../types.ts";
import useWindowResize from "../../hooks/useWindowResize.ts";
import { generateHours, getDivider, ISelectedWeek } from "../../utils.ts";
import Events from "../Events/Events.tsx";
import "./styles.scss";
import OpenedEvent from "../OpenedEvent/OpenedEvent.tsx";
import Hours from "../Hours/Hours.tsx";
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

  function onResize() {
    const hoursResult = generateHours(
      allStartEndHoursStream,
      isCurrentWeek && personInfo?.personIsLive === "true",
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

    const timeStart = dayjs(
      anyDate + " " + _displayedHours[0],
      "YYYY-MM-DD h A",
    );
    const timeEnd = dayjs(
      anyDate + " " + _displayedHours[_displayedHours.length - 1],
      "YYYY-MM-DD h A",
    );

    const minutes = (timeEnd.diff(timeStart, "hours") + divider) * 60; //;
    const gmtBlockWidth = 70;
    const pixInMinute = (hoursContainerWidth - gmtBlockWidth) / minutes;

    const resizeEvents = Object.values(eventsByWeekDay).flat();

    resizeEvents.map((event) => {
      if (event.dateStart) {
        const timeStartDay = dayjs(
          event.dateStart.slice(0, 11) + _displayedHours[0],
          "YYYY-MM-DD h A",
        );
        const timeStartEvent = dayjs(event.dateStart);
        event.marginLeft =
          pixInMinute * timeStartEvent.diff(timeStartDay, "minute");
        event.width = (pixInMinute * event.duration) / 60; // minutes
      }
    });

    console.log(resizeEvents);
  }

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
              key={day.date}
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
              key={index}
              className={
                "stream-schedule-day " + getActiveClass(index, activeWeekDay)
              }
            >
              {eventsByWeekDay[day.date] && (
                <Events
                  events={eventsByWeekDay[day.date]}
                  appInitInfo={appInitData}
                  handleSelectEvent={selectEvent}
                  selectedEventKey={
                    selectedEvent
                      ? selectedEvent.contentId + selectedEvent.type
                      : ""
                  }
                />
              )}
            </div>
          ))}
        </div>

        {selectedEvent && (
          <OpenedEvent event={selectedEvent} closeModal={closeEventModal} />
        )}
      </div>
    </div>
  );
};

export default ScheduleContainer;
