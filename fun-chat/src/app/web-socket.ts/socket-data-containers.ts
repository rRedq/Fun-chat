import { UserData } from '@alltypes/common';
import { MessageHistoryRequest, MsgReadRequest } from '@alltypes/serverRequests';
import { RequestMsg, RequestUsers, ResponseAuthenticationList } from '@alltypes/serverResponse';

const authenticationData = ({ name, password }: UserData, type: ResponseAuthenticationList) => {
  return {
    id: type,
    type,
    payload: {
      user: {
        login: name,
        password,
      },
    },
  };
};

const sendMessageToServer = (message: string, receiver: string): RequestMsg => {
  return {
    id: 'MSG_SEND',
    type: 'MSG_SEND',
    payload: {
      message: {
        to: message,
        text: receiver,
      },
    },
  };
};

const messageHistory = (login: string): MessageHistoryRequest => {
  return {
    id: 'MSG_HISTORY',
    type: 'MSG_FROM_USER',
    payload: {
      user: {
        login,
      },
    },
  };
};

const authenticatedUsers: RequestUsers = {
  id: 'USER_ACTIVE',
  type: 'USER_ACTIVE',
  payload: null,
};

const unauthorizedUsers: RequestUsers = {
  id: 'USER_INACTIVE',
  type: 'USER_INACTIVE',
  payload: null,
};

const msgRead = (id: string): MsgReadRequest => {
  return {
    id: 'MSG_READ',
    type: 'MSG_READ',
    payload: {
      message: {
        id,
      },
    },
  };
};

const msgEdit = (
  id: string,
  text: string
): {
  id: 'MSG_EDIT';
  type: 'MSG_EDIT';
  payload: {
    message: {
      id: string;
      text: string;
    };
  };
} => {
  return {
    id: 'MSG_EDIT',
    type: 'MSG_EDIT',
    payload: {
      message: {
        id,
        text,
      },
    },
  };
};

export {
  authenticationData,
  authenticatedUsers,
  unauthorizedUsers,
  sendMessageToServer,
  messageHistory,
  msgRead,
  msgEdit,
};
