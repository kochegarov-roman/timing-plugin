import { IEvent, IEventsWidth, IPersonInfo } from "../../types.ts";
import { FC } from "react";
import "./styles.scss";
import { ImageWithFallback } from "../Image/Image.tsx";
import defEventImg from "../../assets/def-event.jpeg";

interface IEventsProps {
  event: IEvent;
  personInfo: IPersonInfo;
  selectedEventKey: string;
  eventsWidth: IEventsWidth;
  handleSelectEvent: (event: IEvent) => void;
}

export const Event: FC<IEventsProps> = ({
  event,
  eventsWidth,
  selectedEventKey,
  handleSelectEvent,
  personInfo,
}) => {
  const eventStyle = {
    maxWidth: eventsWidth[event.dateStart].width + "px",
    width: eventsWidth[event.dateStart].width + "px",
    left: (eventsWidth[event.dateStart].marginLeft || 0) + "px",
  };

  const eventClass = "schedule-event" + (event.isLive ? " is-live" : "");

  return (
    <div
      key={"events_" + event.dateStart}
      style={eventStyle}
      className={eventClass}
      onClick={() => handleSelectEvent(event)}
      itemScope
      itemType="https://schema.org/Event"
    >
      <div
        className={
          "stream-schedule-segment--element" +
          (selectedEventKey === event.contentId + event.type
            ? " selected-event"
            : "") +
          (event.isLive ? " live-event" : "")
        }
        style={{
          border: "0.1em solid var(--color-border)",
          borderTopLeftRadius: event.isStartedYesterday ? 0 : "0.6em",
          borderBottomLeftRadius: event.isStartedYesterday ? 0 : "0.6em",
          borderTopRightRadius: event.notEnded ? 0 : "0.6em",
          borderBottomRightRadius: event.notEnded ? 0 : "0.6em",
        }}
      >
        <div className="stream-schedule-segment--fade">
          <div className="text stream-schedule-segment--text">
            <p itemProp="name">{event.title || personInfo.personScreenName}</p>
          </div>
          <div className="text stream-schedule-segment--info">
            <p className="stream-schedule-segment--text" itemProp="description">
              {event.description}
            </p>
            {event.isLive && (
              <>
                <div className="point">·</div>
                <div className="viewers stream-schedule-segment--text">
                  {`${event.viewers} viewers`}
                </div>
              </>
            )}
          </div>
          <div className="hidden">
            <a href={event.srcUrl} itemProp="url"></a>
          </div>
          <div style={{ display: "flex", marginBottom: 0 }}>
            <hr />
            <div className="stream-schedule-segment--text" itemProp="startDate">
              {event.isLive ? "Live Now" : event.date}
            </div>

            <div className="hidden" itemProp="endDate">
              {event.dateEnd}
            </div>
          </div>
        </div>

        {event.previewImgUrl &&
          eventsWidth[event.dateStart].width &&
          eventsWidth[event.dateStart].width > 140 && (
            <div className="preview">
              <ImageWithFallback
                alt={event.title}
                fallbackSrc={defEventImg}
                src={event.previewImgUrl}
              />
              <div className="preview-info">
                {event.isLive ? (
                  <div className="duration live">Live</div>
                ) : (
                  <div className="duration">{event.durationTime}</div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
