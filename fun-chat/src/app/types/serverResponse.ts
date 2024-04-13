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

type Message = {
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
};

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

type WebSocketResponse = AuthResponse | ResponseError | ResponseUsers | ResponseMsg;

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
};
