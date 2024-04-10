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
interface AuthResponseError {
  id: string;
  type: 'ERROR';
  payload: {
    error: string;
  };
}

export { AuthResponse, AuthResponseError };
