/* eslint-disable no-unused-vars */
export interface ServerToClientEvents {
  emitMessageFromServer: (newMessage: any) => void;
  changeNotification: (status: boolean) => void;
  emitAllMessagesFromServer: (newMessage: any) => void;
}
export interface ClientToServerEvents {
  emitMsgFromClient: (userId: number, eventId: number, msg: string) => void;
  joinRoom: (userId: number, eventId: number) => void;
  leaveRoom: (userId: number, eventId: number) => void;
}
