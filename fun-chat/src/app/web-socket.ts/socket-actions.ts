import { serverUrl } from '@shared/const';

import { UserData } from '@alltypes/common';
import { RequestMsg, ResponseAuthenticationList } from '@alltypes/serverResponse';
import { MessageHistoryRequest, MsgReadRequest } from '@alltypes/serverRequests';
import { RemoteServer } from './web-socket';
import {
  sendMessageToServer,
  authenticatedUsers,
  unauthorizedUsers,
  authenticationData,
  messageHistory,
  msgRead,
} from './socket-data-containers';

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

function editMsg(id: string, text: string): void {
  const data: {
    id: 'MSG_EDIT';
    type: 'MSG_EDIT';
    payload: {
      message: {
        id: string;
        text: string;
      };
    };
  } = {
    id: 'MSG_EDIT',
    type: 'MSG_EDIT',
    payload: {
      message: {
        id,
        text,
      },
    },
  };
  webSocket.serverRequest(JSON.stringify(data));
}

const requestDeleteMsg = (id: string): void => {
  const data: {
    id: 'MSG_DELETE';
    type: 'MSG_DELETE';
    payload: {
      message: {
        id: string;
      };
    };
  } = {
    id: 'MSG_DELETE',
    type: 'MSG_DELETE',
    payload: {
      message: {
        id,
      },
    },
  };
  webSocket.serverRequest(JSON.stringify(data));
};

export {
  sendMessage,
  getUsers,
  sendAuthentication,
  getMessageHistoryWithUser,
  changeMsgToReadStatus,
  editMsg,
  requestDeleteMsg,
};
