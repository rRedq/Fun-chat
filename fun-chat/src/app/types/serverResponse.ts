import { MessageHistoryRequest, MsgReadRequest } from './serverRequests';

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
  type: 'USER_EXTERNAL_LOGOUT' | 'USER_EXTERNAL_LOGIN';
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}

interface ResponseUsers {
  id: 'USER_ACTIVE' | 'USER_INACTIVE';
  type: 'USER_ACTIVE' | 'USER_INACTIVE';
  payload: {
    users: User[];
  };
}
interface RequestUsers extends Omit<ResponseUsers, 'payload'> {
  payload: null;
}

interface RequestMsg {
  id: 'MSG_SEND';
  type: 'MSG_SEND';
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
}

interface ResponseMsg extends RequestMsg {
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
  id: 'MSG_EDIT';
  type: 'MSG_EDIT';
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
interface MessageHistoryResponse extends Omit<MessageHistoryRequest, 'payload'> {
  payload: {
    messages: Message[];
  };
}

interface ResponseError {
  id: 'MSG_SEND' | 'USER_ACTIVE' | 'USER_INACTIVE' | 'USER_LOGIN' | 'USER_LOGOUT';
  type: 'ERROR';
  payload: {
    error: string;
  };
}

type User = {
  login: string;
  isLogined: boolean;
};

type ResponseDeleteMsg = {
  id: 'MSG_DELETE';
  type: 'MSG_DELETE';
  payload: {
    message: {
      id: string;
      status: {
        isDeleted: boolean;
      };
    };
  };
};

type WebSocketResponse =
  | AuthResponse
  | ResponseError
  | ResponseUsers
  | ResponseMsg
  | ReceivedMessage
  | MessageHistoryResponse
  | MsgReadResponse
  | ResponseMsg
  | UserAuth
  | EditMsgResponse
  | ResponseDeleteMsg;

type ResponseAuthenticationList = 'USER_LOGIN' | 'USER_LOGOUT';

export {
  AuthResponse,
  ResponseError,
  ResponseAuthenticationList,
  ResponseUsers,
  WebSocketResponse,
  User,
  RequestUsers,
  RequestMsg,
  ResponseMsg,
  Message,
  ReceivedMessage,
  MessageHistoryResponse,
  MsgReadResponse,
  CoreEditMsg,
};
