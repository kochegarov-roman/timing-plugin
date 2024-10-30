import { IEvent } from "../types.ts";
import dayjs from "dayjs";
import { UTC_OFFSET } from "../constants.ts";
import { faker } from "@faker-js/faker";
import defEventImg from "../assets/def-event.jpeg";

const generateRandomEvent = (): IEvent => {
  return {
    title: faker.lorem.words(),
    contentId: faker.number.int(),
    description: faker.lorem.paragraph(),
    duration: faker.number.int({ min: 5000, max: 40000 }),
    createdAt: faker.date
      .between({
        from: dayjs().add(-1, "weeks").format("YYYY-MM-DDTHH:mm:ss"),
        to: dayjs().add(1, "weeks").format("YYYY-MM-DDTHH:mm:ss"),
      })
      .toISOString(),
    previewImgUrl: faker.image.url(),
    srcUrl: faker.internet.url(),
    bought: false,
    price: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
    isLive: false,
    viewers: faker.number.int({ min: 1, max: 100 }),
    views: faker.number.int({ min: 1, max: 10000 }),
    dateStart: "",
    date: "",
    id: faker.number.int(),
    type: faker.string.fromCharacters(["show", "appointment", "broadcast"]),
  };
};

let fakerEvents = new Array(10)
  .fill(0)
  .map(() => generateRandomEvent())
  .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

const filteredEvents: IEvent[] = [];
fakerEvents.forEach((ev, ind) => {
  if (ind === 0) {
    filteredEvents.push(ev);
  } else {
    const a = ev.createdAt;
    const lastApplied = filteredEvents[filteredEvents.length - 1];
    const b = dayjs(lastApplied.createdAt).add(lastApplied.duration, "seconds").toISOString();

    if (a > b) filteredEvents.push(ev);
  }
});

fakerEvents = filteredEvents;

// todo: create many event in one day
// todo: create event started on last week
// todo: create an event ending next week

export const mockEvents: IEvent[] = filteredEvents;

const mockLiveEvent: IEvent = {
  id: 10,
  title: "Event 10",
  contentId: 10,
  description: "Live TEST event",
  duration: 36000,
  createdAt: dayjs()
    .add(-(2 + UTC_OFFSET), "hours")
    .format("YYYY-MM-DDTHH:mm:ss"),
  previewImgUrl: defEventImg,
  srcUrl: "https://via.placeholder.com/300",
  bought: true,
  price: 20,
  views: 12,
  viewers: 123,
  date: "",
  dateStart: "",
  type: "broadcast",
  isLive: true,
};

export const createEventOnCurrentWeek: (events: IEvent[]) => IEvent[] = () => {
  return [...mockEvents, mockLiveEvent];
};
