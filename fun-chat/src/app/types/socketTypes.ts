import { EnumResponses } from './enum';

interface AuthResponse {
  id: ResponseAuthenticationList;
  type: ResponseAuthenticationList;
  payload: {
    user: {
      isLogined: boolean;
      login: string;
    };
  };
}

interface MsgReadResponse extends MsgReadRequest {
  payload: {
    message: {
      id: string;
      status: {
        isReaded: boolean;
      };
    };
  };
}

interface UserAuth {
  id: null;
  type: EnumResponses.externalLogout | EnumResponses.externalLogin;
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}

interface ResponseUsers {
  id: EnumResponses.active | EnumResponses.inactive;
  type: EnumResponses.active | EnumResponses.inactive;
  payload: {
    users: User[];
  };
}
interface RequestUsers extends Omit<ResponseUsers, 'payload'> {
  payload: null;
}

interface ResponseMsg {
  id: EnumResponses.send;
  type: EnumResponses.send;
  payload: {
    message: Message;
  };
}

interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}

interface EditMsgResponse {
  id: EnumResponses.edit;
  type: EnumResponses.edit;
  payload: {
    message: {
      id: string;
      text: string;
      status: {
        isEdited: boolean;
      };
    };
  };
}

interface CoreEditMsg {
  id: string;
  text: string;
  status: {
    isEdited: boolean;
  };
}

interface ReceivedMessage extends Omit<ResponseMsg, 'id'> {
  id: null;
}
type MessageHistoryResponse = {
  id: EnumResponses.count | EnumResponses.history;
  type: 'MSG_FROM_USER';
  payload: {
    messages: Message[];
  };
};

interface ResponseError {
  id: EnumResponses.send | EnumResponses.active | EnumResponses.inactive | EnumResponses.login | EnumResponses.logout;
  type: EnumResponses.error;
  payload: {
    error: string;
  };
}

type User = {
  login: string;
  isLogined: boolean;
};

type ResponseDeleteMsg = {
  id: EnumResponses.delete;
  type: EnumResponses.delete;
  payload: {
    message: {
      id: string;
      status: {
        isDeleted: boolean;
      };
    };
  };
};

type ResponseMsgDeliver = {
  id: null;
  type: EnumResponses.deliver;
  payload: {
    message: {
      id: string;
      status: {
        isDelivered: boolean;
      };
    };
  };
};

interface MsgReadRequest {
  id: EnumResponses.read;
  type: EnumResponses.read;
  payload: {
    message: {
      id: string;
    };
  };
}

type WebSocketResponse =
  | AuthResponse
  | ResponseError
  | ResponseUsers
  | ResponseMsg
  | ReceivedMessage
  | MessageHistoryResponse
  | MsgReadResponse
  | UserAuth
  | EditMsgResponse
  | ResponseDeleteMsg
  | ResponseMsgDeliver;

type ResponseAuthenticationList = EnumResponses.login | EnumResponses.logout;

export {
  AuthResponse,
  ResponseError,
  ResponseAuthenticationList,
  ResponseUsers,
  WebSocketResponse,
  User,
  RequestUsers,
  Message,
  CoreEditMsg,
};
