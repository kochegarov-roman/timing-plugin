import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import { findActiveHour, getDivider } from "../../utils.ts";
import useWindowResize from "../../hooks/useWindowResize.ts";

interface IHoursProps {
  isCurrentWeek: boolean;
  displayedHours: string[];
  hoursContainerWidth: number;
}

const Hours: FC<IHoursProps> = ({
  isCurrentWeek,
  hoursContainerWidth,
  displayedHours,
}) => {
  function getActiveHourClass(hour: string) {
    return isCurrentWeek && activeHour === hour ? "active" : "";
  }

  const [activeHour, setActiveHour] = useState(dayjs().format("h A"));
  const [flexBasisItem, setFlexBasisItem] = useState("0");

  const { width } = useWindowResize();

  useEffect(() => {
    const divider = getDivider(hoursContainerWidth);
    setFlexBasisItem(hoursContainerWidth / divider - 10 + "px");
    setActiveHour(findActiveHour(divider, displayedHours));
  }, [isCurrentWeek, width, hoursContainerWidth]);

  const utcOffset = dayjs().utcOffset() / 60;

  return (
    <div className="schedule">
      <div className="stream-schedule-times">
        <div className="gmt">
          <p className="week-td">GMT+{utcOffset}</p>
        </div>
        {displayedHours.map((hour) => (
          <div
            key={"displayedHours_" + hour}
            className={`hours ${getActiveHourClass(hour)}`}
            style={{ flexBasis: flexBasisItem }}
          >
            <p className="hour">{hour}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hours;
