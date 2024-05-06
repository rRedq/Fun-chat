import { serverUrl } from '@shared/const';
import { UserData } from '@alltypes/common';
import { ResponseAuthenticationList } from '@alltypes/socketTypes';
import { EnumResponses } from '@alltypes/enum';
import { RemoteServer } from './web-socket';
import { authenticatedUsers, unauthorizedUsers } from './socket-data-containers';

export const webSocket = new RemoteServer(serverUrl);

function getUsers(): void {
  webSocket.serverRequest(JSON.stringify(authenticatedUsers));
  webSocket.serverRequest(JSON.stringify(unauthorizedUsers));
}

function sendMessage(receiver: string, msg: string): void {
  const data: {
    id: EnumResponses.send;
    type: EnumResponses.send;
    payload: {
      message: {
        to: string;
        text: string;
      };
    };
  } = {
    id: EnumResponses.send,
    type: EnumResponses.send,
    payload: {
      message: {
        to: receiver,
        text: msg,
      },
    },
  };
  webSocket.serverRequest(JSON.stringify(data));
}

function sendAuthentication({ name, password }: UserData, type: ResponseAuthenticationList): void {
  const data: {
    id: ResponseAuthenticationList;
    type: ResponseAuthenticationList;
    payload: {
      user: {
        login: string;
        password: string;
      };
    };
  } = {
    id: type,
    type,
    payload: {
      user: {
        login: name,
        password,
      },
    },
  };
  webSocket.serverRequest(JSON.stringify(data));
}

function changeMsgToReadStatus(id: string): void {
  const data: {
    id: string;
    type: EnumResponses.read;
    payload: {
      message: {
        id: string;
      };
    };
  } = {
    id: EnumResponses.read,
    type: EnumResponses.read,
    payload: {
      message: {
        id,
      },
    },
  };
  webSocket.serverRequest(JSON.stringify(data));
}

const getMessageHistoryWithUser = <T extends EnumResponses.count | EnumResponses.history>(
  login: string,
  type: T
): void => {
  const data: {
    id: T;
    type: 'MSG_FROM_USER';
    payload: {
      user: {
        login: string;
      };
    };
  } = {
    id: type,
    type: 'MSG_FROM_USER',
    payload: {
      user: {
        login,
      },
    },
  };
  webSocket.serverRequest(JSON.stringify(data));
};

function editMsg(id: string, text: string): void {
  const data: {
    id: EnumResponses.edit;
    type: EnumResponses.edit;
    payload: {
      message: {
        id: string;
        text: string;
      };
    };
  } = {
    id: EnumResponses.edit,
    type: EnumResponses.edit,
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
    id: EnumResponses.delete;
    type: EnumResponses.delete;
    payload: {
      message: {
        id: string;
      };
    };
  } = {
    id: EnumResponses.delete,
    type: EnumResponses.delete,
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
