import { AuthResponse, ResponseError, ResponseUsers } from '@alltypes/socketTypes';
import { socketEmitter } from '@shared/const';

function getUsers(response: ResponseUsers): void {
  socketEmitter.emit('users-get-active', { data: response.payload.users });
}

function logIn(response: AuthResponse | ResponseError): void {
  if (response.type === 'USER_LOGIN') {
    socketEmitter.emit('app-auth-success', { login: response.payload.user.login });
  } else if (response.type === 'ERROR') {
    socketEmitter.emit('app-auth-error', { error: response.payload.error });
  }
}

function logOut(response: AuthResponse | ResponseError): void {
  if (response.type === 'USER_LOGOUT') {
    socketEmitter.emit('app-logout-success', { status: true });
  } else if (response.type === 'ERROR') {
    console.error(response.type, response.payload.error);
  }
}

export { getUsers, logIn, logOut };
