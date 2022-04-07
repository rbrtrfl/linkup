import { LuEvent } from './Event';

export interface LocationState {
  state: { currentEvent: LuEvent }
}
export interface MessageContentToDisplay {
  userName: string,
  userPhoto: string,
  userId?: number,
  message: string,
  currentUserFlag: boolean,
}

export interface MessageFromDb {
  content: string,
  date_created: string,
  event_id: number,
  id_message: number,
  user_id: number,
  user: {
    first_name: string,
    id_user: number,
    profile_picture: string
  }
}
export interface ServerToClientEvents {
  emitMessageFromServer: (newMessage: MessageFromDb) => void;
  emitAllMessagesFromServer: (messages: MessageFromDb[]) => void;
}

export interface ClientToServerEvents {
  emitMsgFromClient: (userId: number, eventId: number, msg: string) => void;
  joinRoom: (userId: number, eventId: number) => void;
}
