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

type ResponseAuthenticationList = 'USER_LOGIN' | 'USER_LOGOUT';

export { AuthResponse, ResponseError, ResponseAuthenticationList };
