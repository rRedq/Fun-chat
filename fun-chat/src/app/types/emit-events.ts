import { LoginInputNames } from './common';
import { CoreEditMsg, Message, User } from './serverResponse';

interface LoginEvents {
  'login-input': { value: string; name: LoginInputNames };
  'login-auth': { event: Event };
}

interface AppEvents {
  'app-auth-success': { login: string };
  'app-auth-error': { error: string };
  'app-logout': { status: boolean };
  'app-logout-success': { status: boolean };
  'users-get-active': { data: User[] };
  'users-get-inactive': { data: User[] };
  'user-logout': { user: User };
  'user-login': { user: User };
  'msg-send': { message: Message };
  'msg-receive': { message: Message };
  'response-messeges': { messages: Message[] };
  'msg-read': { id: string; isReaded: boolean };
  'response-change-msg': {
    response: CoreEditMsg;
  };
  'response-delete-msg': { id: string };
  'response-msg-count': { messages: Message[] };
  'open-socket': { status: boolean };
  'click-info': { direction: 'to' | 'from' };
}

interface UserListEvents {
  'list-input': { value: string };
  'list-user-active': { user: User };
}

interface ChatEvents {
  'chat-conversation': { user: User };
  'chat-msg': { text: string };
  'chat-change-read-status': { status: boolean };
  'change-msg': { id: string; text: string };
  'change-msg-success': { id: string; text: string };
}

export { LoginEvents, AppEvents, UserListEvents, ChatEvents };
