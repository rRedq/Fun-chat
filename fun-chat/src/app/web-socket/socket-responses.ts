import { EnumResponses } from '@alltypes/enum';
import { AuthResponse, ResponseError, ResponseUsers } from '@alltypes/socketTypes';
import { socketEmitter } from '@shared/const';

function getUsers(response: ResponseUsers): void {
  socketEmitter.emit('users-get-active', { data: response.payload.users });
}

function logIn(response: AuthResponse | ResponseError): void {
  if (response.type === EnumResponses.login) {
    socketEmitter.emit('app-auth-success', { login: response.payload.user.login });
  } else if (response.type === EnumResponses.error) {
    socketEmitter.emit('app-auth-error', { error: response.payload.error });
  }
}

function logOut(response: AuthResponse | ResponseError): void {
  if (response.type === EnumResponses.logout) {
    socketEmitter.emit('app-logout-success', { status: true });
  } else if (response.type === EnumResponses.error) {
    console.error(response.type, response.payload.error);
  }
}

export { getUsers, logIn, logOut };
