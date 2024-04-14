import { serverUrl } from '@shared/const';
import {
  authenticatedUsers,
  authenticationData,
  messageHistory,
  msgRead,
  sendMessageToServer,
  unauthorizedUsers,
} from '@utils/socket-data-containers';
import { UserData } from '@alltypes/common';
import { RequestMsg, ResponseAuthenticationList } from '@alltypes/serverResponse';
import { MessageHistoryRequest, MsgReadRequest } from '@alltypes/serverRequests';
import { RemoteServer } from './web-socket';

export const webSocket = new RemoteServer(serverUrl);

function sendMessage(receiver: string, msg: string): void {
  const data: RequestMsg = sendMessageToServer(receiver, msg);
  webSocket.serverRequest(JSON.stringify(data));
}

function getUsers(): void {
  webSocket.serverRequest(JSON.stringify(authenticatedUsers));
  webSocket.serverRequest(JSON.stringify(unauthorizedUsers));
}

function sendAuthentication(userData: UserData, type: ResponseAuthenticationList): void {
  const data = authenticationData(userData, type);
  webSocket.serverRequest(JSON.stringify(data));
}

function getMessageHistoryWithUser(login: string): void {
  const data: MessageHistoryRequest = messageHistory(login);
  webSocket.serverRequest(JSON.stringify(data));
}

function changeMsgToReadStatus(id: string): void {
  const data: MsgReadRequest = msgRead(id);
  webSocket.serverRequest(JSON.stringify(data));
}

export { sendMessage, getUsers, sendAuthentication, getMessageHistoryWithUser, changeMsgToReadStatus };
