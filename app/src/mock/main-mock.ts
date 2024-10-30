import { IAppInitData, IPersonInfo } from "../types.ts";
import { faker } from "@faker-js/faker";

export const appInitDataMock: IAppInitData = {
  rootIdSelector: "root",
};

export const personInfoMock: IPersonInfo = {
  id: faker.number.int({ min: 1, max: 100 }),
  personUrl: faker.internet.url(),
  personScreenName: faker.lorem.words(),
  personAvatar: faker.image.avatar(),
  personBroadcastPreview: faker.image.url(),
  personChatType: "Free",
  personChatTopicDescription: faker.lorem.words(),
  personLastOnlineTime: faker.date.past().toISOString(),
  personChatViewers: faker.number.int({ min: 0, max: 40000 }),
  personIsLive: false,
};
