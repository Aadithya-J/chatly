export enum MessageTypes {
  LOG = "log",
  MESSAGE_SENT = "message-sent",
  SWITCH_SERVER = "switch-server",
  NEW_TEXT = "new-text",
  SERVER_MISMATCH = "server-mismatch",
}

export type MessageType = {
  type: MessageTypes;
  data: string;
  channelId: string;
  serverId: string;
  userName: string;
};
