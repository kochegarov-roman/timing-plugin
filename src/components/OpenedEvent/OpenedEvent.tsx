import {FC, useState} from 'react';
import './styles.scss';
import {IEvent, IModalEvent} from "../../types.ts";
import dayjs from "dayjs";

interface IOpenedEventProps {
    event: IModalEvent,
    utcOffset: number,
    closeModal: () => void,
}

const OpenedEvent: FC<IOpenedEventProps> = ({ event, closeModal, utcOffset }) => {

    const [isLinkCopied, setIsLinkCopied] = useState(false)
    const now = dayjs();
    const nowTime = now.format('hh:mm A');

    function handleCopyLinkClick() {
        navigator.clipboard.writeText(document.location.origin + event.srcUrl);
        setIsLinkCopied(true);
        setTimeout(() => {
            setIsLinkCopied(false);
        }, 3000);
    }

    function getTitleAction(event: IEvent) {
        return event.type === 'show'
            ? event.bought
                ? "Bought"
                : event.price > 0
                    ? "Buy ticket"
                    : "Free"
            : "Watch Past Broadcast"
    }


    return (
        <div>
            <div className="overlay-modal" onClick={closeModal}></div>
            <div className="modal-event">
                <div role="dialog" className="wrapper">
                    <div className="schedule-event" style={{border: '0.1em solid transparent'}}>
                        <div className="stream-schedule-segment__popover-thumbnail">
                            <img src={event.previewImgUrl} alt={event.description}/>
                            <div className="stream-schedule-segment__popover-thumbnail__underlay"
                                 style={{backgroundImage: `url(${event.previewImgUrl})`}}></div>
                        </div>
                        <div className="broadcaster-info" style={{marginTop: '-2em'}}>
                            <figure>
                                <img alt={event.performerScreenName} src={event.performerAvatar}/>
                            </figure>
                            <div className="screen-name">
                                <p>{event.performerScreenName}</p>
                            </div>
                        </div>
                        <div className={'event-info' + (event.isLive ? ' is-live' : '')}>
                            <div className="event-info__row">
                                <p className="title stream-schedule-segment--text">{event.title === 'null' ? event.performerScreenName : event.title}</p>
                            </div>

                            <div className="text event-info__row">
                                <div className="segment-info">
                                    {event.isLive && (
                                        <div className="status-text-indicator">
                                            <p className="live">Live</p>
                                        </div>
                                    )}
                                    <p className="stream-schedule-segment--text">{event.description}</p>
                                    <div className="point"></div>
                                </div>
                            </div>

                            <div className="event-info__row">
                                <a
                                    className="play-icon"
                                    href={event.isLive ? event.performerUrl : event.srcUrl}
                                >
                                    <figure>
                                        <svg width="100%" height="100%" viewBox="0 0 20 20">
                                            <path
                                                d="M5 17.066V2.934a.5.5 0 0 1 .777-.416L17 10 5.777 17.482A.5.5 0 0 1 5 17.066z"></path>
                                        </svg>
                                    </figure>
                                    {event.isLive ? <div>Join Stream</div> : <div>{getTitleAction(event)}</div>}
                                </a>
                            </div>

                            <div className="event-info__row" style={{display: 'flex'}}>
                                <hr/>
                                <div className="stream-schedule-segment--text">
                                    {event.isLive ? (
                                        <p>
                                            {event.startDateLong}
                                            <span> · </span>
                                            {event.startTime} - {nowTime} GMT+{utcOffset}
                                        </p>
                                    ) : (
                                        <p>
                                            {event.date}
                                            <span> · </span>
                                            {!event.price ? "Free" :  `${event.price} credits`}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {event.type === 'broadcast' && (
                                <div className="event-info__row">
                                    <button className="copy-link" onClick={handleCopyLinkClick}>
                                        <figure>
                                            <svg width="100%" height="100%" viewBox="0 0 20 20">
                                                <path
                                                    d="M15 9h-2V7a3 3 0 1 0-6 0v2H5V7a5 5 0 0 1 10 0v2zm-2 4v-2h2v2a5 5 0 0 1-10 0v-2h2v2a3 3 0 1 0 6 0z"></path>
                                                <path d="M11 7H9v6h2V7z"></path>
                                            </svg>
                                        </figure>
                                        <div>Copy Link</div>
                                    </button>
                                    {isLinkCopied && <div style={{float: 'right'}}>Link copied</div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="close-modal" onClick={closeModal}>
                    <button aria-label="Close">
                        <figure>
                            <svg width="100%" height="100%" viewBox="0 0 20 20">
                                <path
                                    d="M8.5 10 4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z"></path>
                            </svg>
                        </figure>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OpenedEvent;