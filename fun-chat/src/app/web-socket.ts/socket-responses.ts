import {
  AuthResponse,
  ReceivedMessage,
  ResponseError,
  ResponseMsg,
  ResponseUsers,
  MessageHistoryResponse,
  MsgReadResponse,
} from '@alltypes/serverResponse';
import { socketEmitter } from '@shared/const';

function getUsers(response: ResponseUsers): void {
  socketEmitter.emit('app-get-users', { data: response.payload.users });
}

function receiveMessage(response: ReceivedMessage): void {
  socketEmitter.emit('msg-receive', { message: response.payload.message });
}

function sendMessage(response: ResponseMsg): void {
  socketEmitter.emit('msg-send', { message: response.payload.message });
}

function logIn(response: AuthResponse): void {
  socketEmitter.emit('app-auth-success', { login: response.payload.user.login });
}

function logOut(response: AuthResponse | ResponseError): void {
  if (response.type === 'USER_LOGOUT') {
    socketEmitter.emit('app-logout-success', { status: true });
  } else if (response.type === 'ERROR') {
    console.error(response.type, response.payload.error);
  }
}

function messageHistoryResponse(response: MessageHistoryResponse): void {
  socketEmitter.emit('response-messeges', { messages: response.payload.messages });
}

function messageIsRead(response: MsgReadResponse): void {
  socketEmitter.emit('msg-read', {
    id: response.payload.message.id,
    isReaded: response.payload.message.status.isReaded,
  });
}

export { getUsers, receiveMessage, sendMessage, logIn, logOut, messageHistoryResponse, messageIsRead };
