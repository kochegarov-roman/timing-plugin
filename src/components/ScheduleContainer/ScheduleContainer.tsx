import {FC, useEffect, useMemo, useState} from 'react';
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import weekday from 'dayjs/plugin/weekday';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {IAppInitData, IEvent, IModalEvent} from "../../types.ts";
import useWindowResize from '../../hooks/useWindowResize.ts';
import {
    generateHours,
    generateWeekDays, getDivider,
    transformLongEvent
} from '../../utils.ts';
import Events from '../Events/Events.tsx';
import './styles.scss';
import OpenedEvent from "../OpenedEvent/OpenedEvent.tsx";
import ScheduleControls from "../ScheduleControls/ScheduleControls.tsx";
import {createEventOnCurrentWeek} from "../../mock";
import Hours from "../Hours/Hours.tsx";
import {IMockEvents} from "../../mock/mock-events.ts";

dayjs.extend(weekday);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);


interface ScheduleContainerProps {
    appInitData: IAppInitData
}

const ScheduleContainer: FC<ScheduleContainerProps> = ({appInitData}) => {

    const utcOffset = dayjs().utcOffset() / 60;
    const [eventsByWeekDay, setEventsByWeekDay] = useState<Record<string, IEvent[]>>({})

    const [allStartEndHoursStream, setAllStartEndHoursStream] = useState<string[]>([]);
    let isCurrentWeek = true;

    const activeWeekDay = parseInt(dayjs().format('d'));

    const [displayedHours, setDisplayedHours] = useState<string[]>([]);

    const {width} = useWindowResize();

    const [offsetWeek, setOffsetWeek] = useState(0);
    const [selectedWeek] = useState(generateWeekDays(offsetWeek));


    function getActiveClass(index: number, value: number) {
        return isCurrentWeek && index == (value || 7) - 1 ? 'active' : '';
    }


    // todo: вынести это на уровень выше вместе с fetchEvents
    useEffect(() => {
        initEvents();
    }, []);

    useEffect(() => {
        onResize();
    }, [width, allStartEndHoursStream]);


    const hoursContainerWidth =  document.getElementById(appInitData.widthIdSelector)?.offsetWidth || 500;

    function onResize() {

        const hoursResult = generateHours(allStartEndHoursStream, isCurrentWeek && appInitData.performerIsLive === "true");
        let divider = 1;

        const anyDate = dayjs().format('YYYY-MM-DD');
        if (hoursResult.length > 5) {
            divider = getDivider(hoursContainerWidth);
        }

        const _displayedHours = hoursResult.filter((hour) => parseInt(hour.split(' ')[0]) % divider === 0);
        setDisplayedHours(_displayedHours);

        const timeStart = dayjs(anyDate + ' ' + _displayedHours[0], 'YYYY-MM-DD h A');
        const timeEnd = dayjs(anyDate + ' ' + _displayedHours[_displayedHours.length - 1], 'YYYY-MM-DD h A');

        const minutes = (timeEnd.diff(timeStart, 'hours') + divider) * 60; //;
        const gmtBlockWidth = 70;
        const pixInMinute = (hoursContainerWidth - gmtBlockWidth) / minutes;

        const resizeEvents = Object.values(eventsByWeekDay).flat();

        resizeEvents.forEach((event) => {
            if (event.dateStart) {
                const timeStartDay = dayjs(event.dateStart.slice(0, 11) + _displayedHours[0], 'YYYY-MM-DD h A');
                const timeStartEvent = dayjs(event.dateStart);
                event.marginLeft = pixInMinute * timeStartEvent.diff(timeStartDay, 'minute');
                event.width = (pixInMinute * event.duration) / 60; // minutes
            }
        });

        console.log(resizeEvents)
    }

    const [selectedEvent, setSelectEvent] = useState<IModalEvent | null>(null);

    function closeEventModal() {
        setSelectEvent(null);
    }

    function selectEvent(event: IEvent) {
        setSelectEvent({
            ...event,
            ...appInitData,
        })
    }

    // function fetchEvents(sw: ISelectedWeek[]) {
    //     const createdFrom = sw[0].day.subtract(1, 'week').format('MM/DD/YYYY');
    //     const createdTo = sw[sw.length - 1].day.format('MM/DD/YYYY');
    //     isCurrentWeek = selectedWeek[0].day.format('MM/DD') === dayjs().weekday(1).format('MM/DD');
    //     console.log(sw, createdFrom, createdTo);
    //     initEvents(); // createdFrom, createdTo
    // }

    let events: IEvent[] = Array(7);

    const responseEvent = useMemo<IMockEvents[]>(() => {
        return createEventOnCurrentWeek();
    }, []);

    // createdFrom: string, createdTo: string
    function initEvents() {

        events = [];

        responseEvent.forEach((ev: IEvent) => {
            ev.dateStart = dayjs(ev.createdAt).add(utcOffset, 'hours').format('YYYY-MM-DD HH:mm:ss');
            ev.weekDay = parseInt(dayjs(ev.dateStart).format('d'));
            ev.dateEnd = dayjs(ev.dateStart).add(ev.duration, 'second').format('YYYY-MM-DD HH:mm:ss');
            ev.date = dayjs(ev.dateStart).fromNow();
            ev.startDateLong = dayjs(ev.dateStart).format('dddd, MMM D, YYYY');
            ev.startTime = dayjs(ev.dateStart).format('hh:mm A');
            ev.endTime = dayjs(ev.dateEnd).format('hh:mm A');
            ev.durationTime = new Date(ev.duration * 1000).toISOString().substring(11, 19);
            events.push(ev);
        });

        const _eventsByWeekDay = transformLongEvent(events);

        setEventsByWeekDay(_eventsByWeekDay);

        const week = selectedWeek.map(e => e.date);
        const _hoursStream: string[] = [];
        // get hours
        week.forEach(day => {
            if (_eventsByWeekDay[day])
                _eventsByWeekDay[day].forEach(ev => {
                    if (ev.dateStart && ev.dateEnd) {
                        _hoursStream.push(ev.dateStart.slice(11, 19));
                        _hoursStream.push(ev.dateEnd.slice(11, 19));
                        if (ev.isLive && ev.weekDay && ev.weekDay < activeWeekDay) _hoursStream.push('00:00:00');
                    }
                })
        });

        setAllStartEndHoursStream(_hoursStream);
    }


    return (
        <div>
            <ScheduleControls selectedWeek={selectedWeek} setOffsetWeek={setOffsetWeek}/>
            <Hours displayedHours={displayedHours} isCurrentWeek={isCurrentWeek} hoursContainerWidth={hoursContainerWidth}/>
            <div className="stream-schedule">
                <div className="stream-schedule-week week-td">
                    {selectedWeek.map((day, index) => (
                        <div
                            key={day.date}
                            className={`weekday ${getActiveClass(index, activeWeekDay)}`}
                        >
                            {day.weekDay}
                            <br/>
                            {day.date}
                        </div>
                    ))}
                </div>

                <div className="stream-schedule__events">
                    {selectedWeek.map((day, index) => (
                        <div key={index} className={'stream-schedule-day ' + getActiveClass(index, activeWeekDay)}>
                            {eventsByWeekDay[day.date] && (
                                <Events
                                    events={eventsByWeekDay[day.date]}
                                    appInitInfo={appInitData}
                                    handleSelectEvent={selectEvent}
                                    selectedEventKey={selectedEvent ? selectedEvent.contentId + selectedEvent.type : ''}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {selectedEvent &&
                    <OpenedEvent
                        event={selectedEvent}
                        utcOffset={utcOffset}
                        closeModal={closeEventModal}/>}
            </div>
        </div>
    );
};

export default ScheduleContainer;
