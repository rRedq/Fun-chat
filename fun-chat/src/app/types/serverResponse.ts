interface AuthResponseSucces {
  id: string;
  type: 'USER_LOGIN';
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

export { AuthResponseSucces, AuthResponseError };
