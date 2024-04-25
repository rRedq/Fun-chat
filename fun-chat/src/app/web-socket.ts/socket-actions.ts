import { serverUrl } from '@shared/const';
import { UserData } from '@alltypes/common';
import { ResponseAuthenticationList } from '@alltypes/socketTypes';
import { RemoteServer } from './web-socket';
import { authenticatedUsers, unauthorizedUsers } from './socket-data-containers';

export const webSocket = new RemoteServer(serverUrl);

function getUsers(): void {
  webSocket.serverRequest(JSON.stringify(authenticatedUsers));
  webSocket.serverRequest(JSON.stringify(unauthorizedUsers));
}

function sendMessage(receiver: string, msg: string): void {
  const data: {
    id: 'MSG_SEND';
    type: 'MSG_SEND';
    payload: {
      message: {
        to: string;
        text: string;
      };
    };
  } = {
    id: 'MSG_SEND',
    type: 'MSG_SEND',
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
    type: 'MSG_READ';
    payload: {
      message: {
        id: string;
      };
    };
  } = {
    id: 'MSG_READ',
    type: 'MSG_READ',
    payload: {
      message: {
        id,
      },
    },
  };
  webSocket.serverRequest(JSON.stringify(data));
}

const getMessageHistoryWithUser = <T extends 'MSG_COUNT' | 'MSG_HISTORY'>(login: string, type: T): void => {
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
