interface AuthResponse {
  id: string;
  type: 'USER_LOGIN' | 'USER_LOGOUT';
  payload: {
    user: {
      isLogined: boolean;
      login: string;
    };
  };
}
interface ResponseError {
  id: string;
  type: 'ERROR';
  payload: {
    error: string;
  };
}

export { AuthResponse, ResponseError };
