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
interface ResponseError {
  id: ResponseAuthenticationList;
  type: 'ERROR';
  payload: {
    error: string;
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

type User = {
  login: string;
  isLogined: boolean;
};

type WebSocketResponse = AuthResponse | ResponseError | ResponseUsers;

type ResponseAuthenticationList = 'USER_LOGIN' | 'USER_LOGOUT';

export {
  AuthResponse,
  ResponseError,
  ResponseAuthenticationList,
  ResponseUsers,
  WebSocketResponse,
  User,
  RequestUsers,
};
