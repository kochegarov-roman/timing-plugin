import {IMockEvents, mockEvent} from "./mock-events.ts";
import dayjs from "dayjs";

function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export const createEventOnCurrentWeek: () => IMockEvents[] = () => {
    return mockEvent.map(event => {
        const randomDate = [getRandomArbitrary(1, 6), getRandomArbitrary(1, 23), getRandomArbitrary(1, 59)];
        event.createdAt = dayjs().add(-randomDate[0], 'days').add(randomDate[1], 'hours').add(randomDate[2], 'minutes').format('YYYY-MM-DD HH:mm:ss');
        return event;
    })
}