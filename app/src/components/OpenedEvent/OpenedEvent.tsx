import { FC, useState } from "react";
import "./styles.scss";
import { IEvent, IModalEvent, IPersonInfo } from "../../types.ts";
import dayjs from "dayjs";
import { UTC_OFFSET } from "../../constants.ts";
import defEventImg from "../../assets/def-event.jpeg";
import { ImageWithFallback } from "../Image/Image.tsx";

interface IOpenedEventProps {
  event: IModalEvent;
  closeModal: () => void;
  personInfo: IPersonInfo;
}

const OpenedEvent: FC<IOpenedEventProps> = ({
  event,
  closeModal,
  personInfo,
}) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const now = dayjs();
  const nowTime = now.format("hh:mm A");

  function handleCopyLinkClick() {
    navigator.clipboard.writeText(document.location.origin + event.srcUrl);
    setIsLinkCopied(true);
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 3000);
  }

  function getTitleAction(event: IEvent) {
    return event.type === "show"
      ? event.bought
        ? "Bought"
        : event.price > 0
          ? "Buy ticket"
          : "Free"
      : "Watch Past Broadcast";
  }

  return (
    <div>
      <div className="overlay-modal" onClick={closeModal}></div>
      <div className="modal-event">
        <div role="dialog" className="wrapper">
          <div
            className="opened-schedule-event"
            style={{ border: "0.1em solid transparent" }}
          >
            <div className="stream-schedule-segment__popover-thumbnail">
              <ImageWithFallback
                alt={event.title}
                fallbackSrc={defEventImg}
                src={event.previewImgUrl}
              />
              <div
                className="stream-schedule-segment__popover-thumbnail__underlay"
                style={{ backgroundImage: `url(${event.previewImgUrl})` }}
              ></div>
            </div>
            <div className="broadcaster-info" style={{ marginTop: "-2em" }}>
              <figure>
                <img
                  alt={personInfo.personScreenName}
                  src={personInfo.personAvatar}
                />
              </figure>
              <div className="screen-name">
                <p>{personInfo.personScreenName}</p>
              </div>
            </div>
            <div className={"event-info" + (event.isLive ? " is-live" : "")}>
              <div className="event-info__row">
                <p className="title stream-schedule-segment--text">
                  {event.title || personInfo.personScreenName}
                </p>
              </div>

              <div className="text event-info__row">
                <div className="segment-info">
                  {event.isLive && (
                    <div className="status-text-indicator">
                      <p className="live">Live</p>
                    </div>
                  )}
                  <p className="stream-schedule-segment--text">
                    {event.description}
                  </p>
                  <div className="point"></div>
                </div>
              </div>

              <div className="event-info__row">
                <a
                  target="_blank"
                  className="play-icon"
                  href={event.isLive ? personInfo.personUrl : event.srcUrl}
                  rel="noreferrer"
                >
                  <figure>
                    <svg width="100%" height="100%" viewBox="0 0 20 20">
                      <path d="M5 17.066V2.934a.5.5 0 0 1 .777-.416L17 10 5.777 17.482A.5.5 0 0 1 5 17.066z"></path>
                    </svg>
                  </figure>
                  {event.isLive ? (
                    <div>Join Stream</div>
                  ) : (
                    <div>{getTitleAction(event)}</div>
                  )}
                </a>
              </div>

              <div className="event-info__row" style={{ display: "flex" }}>
                <hr />
                <div className="stream-schedule-segment--text">
                  {event.isLive ? (
                    <p>
                      {event.startDateLong}
                      <span> · </span>
                      {event.startTime} - {nowTime} GMT+{UTC_OFFSET}
                    </p>
                  ) : (
                    <p>
                      {event.date}
                      <span> · </span>
                      {!event.price ? "Free" : `${event.price} credits`}
                    </p>
                  )}
                </div>
              </div>

              {event.type === "broadcast" && (
                <div className="event-info__row">
                  <button className="copy-link" onClick={handleCopyLinkClick}>
                    <figure>
                      <svg width="100%" height="100%" viewBox="0 0 20 20">
                        <path d="M15 9h-2V7a3 3 0 1 0-6 0v2H5V7a5 5 0 0 1 10 0v2zm-2 4v-2h2v2a5 5 0 0 1-10 0v-2h2v2a3 3 0 1 0 6 0z"></path>
                        <path d="M11 7H9v6h2V7z"></path>
                      </svg>
                    </figure>
                    <div>Copy Link</div>
                  </button>
                  {isLinkCopied && <div className="copied">Link copied</div>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="close-modal" onClick={closeModal}>
          <button aria-label="Close">
            <figure>
              <svg width="100%" height="100%" viewBox="0 0 20 20">
                <path d="M8.5 10 4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z"></path>
              </svg>
            </figure>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenedEvent;
