import dayjs from "dayjs";

export interface IResponse {
  shows: IEventResponse[];
  broadcasts: IEventResponse[];
  res: boolean;
  msg: string;
}

export interface IEventResponse {
  title: string;
  contentId: number;
  description: string;
  duration: number;
  createdAt: string;
  previewImgUrl: string;
  srcUrl: string;
  bought: boolean | null;
  price: number;
  isLive?: boolean;
  viewers?: number;
  type: string;
  onClickMethod?: string;
}

export interface IEvent extends IEventResponse {
  views: number;
  date: string;
  dateStart: string;
  dateEnd?: string;
  durationTime?: string;
  startDateLong?: string;

  startTime?: string;
  endTime?: string;

  weekDay?: number;
  marginLeft?: number;
  notEnded?: boolean;
  isStartedYesterday?: boolean;
  width?: number;
  id: number;
}

export interface IEventsWidth {
  [key: string]: {
    marginLeft: number;
    width: number;
  };
}

export interface FetchError {
  message: string;
  code: number;
}

export interface IPersonInfo {
  id: number;
  personUrl: string;
  personScreenName: string;
  personAvatar: string;
  personBroadcastPreview: string;
  personChatType: string;
  personChatTopicDescription: string;
  personLastOnlineTime: string;
  personChatViewers: number;
  personIsLive: boolean;
}

export interface IAppInitData {
  rootIdSelector: string;
}

interface ISelectedWeek {
  weekDay: string;
  day: dayjs.Dayjs;
  date: string;
}

export type { ISelectedWeek };

export interface IModalEvent extends IAppInitData, IEvent {}

export interface IWeekState {
  offsetWeek: number;
  selectedWeek: ISelectedWeek[];
  weekFrom: string;
  weekTo: string;
}
