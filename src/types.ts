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
  type: "show" | "appointment" | "broadcast";
  onClickMethod?: string;
}

export interface IEvent extends IEventResponse {
  views: number;
  date?: string;
  dateStart?: string;
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
}

export interface IPerformerInfo {
  performerId: string;
  performerUrl: string;
  performerScreenName: string;
  performerAvatar: string;
  performerBroadcastPreview: string;
  performerChatType: string;
  performerChatTopicDescription: string;
  performerLastOnlineTime: string;
  performerChatViewers: string;
  performerIsLive: string;
}

export interface IAppInitData extends IPerformerInfo {
  widthIdSelector: string;
}

export interface IModalEvent extends IAppInitData, IEvent {}
