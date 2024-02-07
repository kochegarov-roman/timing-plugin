import { IAppInitData, IEvent } from "../../types.ts";
import { FC } from "react";
import "./styles.scss";

interface IEventsProps {
  events: IEvent[];
  appInitInfo: IAppInitData;
  selectedEventKey: string;
  handleSelectEvent: (event: IEvent) => void;
}

const Events: FC<IEventsProps> = ({
  events,
  selectedEventKey,
  handleSelectEvent,
  appInitInfo,
}) => {
  return (
    <>
      {events.map((event) => (
        <div
          key={"events_" + event.dateStart}
          style={{
            maxWidth: event.width + "px",
            width: event.width + "px",
            left: (event.marginLeft || 0) + "px",
          }}
          className={"schedule-event" + (event.isLive ? " is-live" : "")}
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
                <p itemProp="name">
                  {event.title === "null"
                    ? appInitInfo.performerScreenName
                    : event.title}
                </p>
              </div>
              <div className="text stream-schedule-segment--info">
                <p
                  className="stream-schedule-segment--text"
                  itemProp="description"
                >
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
                <div
                  className="stream-schedule-segment--text"
                  itemProp="startDate"
                >
                  {event.isLive ? "Live Now" : event.date}
                </div>

                <div className="hidden" itemProp="endDate">
                  {event.dateEnd}
                </div>
              </div>
            </div>

            {event.previewImgUrl && event.width && event.width > 140 && (
              <div className="preview">
                <img
                  src={event.previewImgUrl}
                  alt={event.description}
                  itemProp="image"
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
      ))}
    </>
  );
};

export default Events;
