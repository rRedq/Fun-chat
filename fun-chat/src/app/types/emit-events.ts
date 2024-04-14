import { LoginInputNames } from './common';
import { Message, User } from './serverResponse';

interface LoginEvents {
  'login-input': { value: string; name: LoginInputNames };
  'login-auth': { event: Event };
}

interface AppEvents {
  'app-auth-success': { login: string };
  'app-auth-error': { error: string };
  'app-logout': { status: boolean };
  'app-logout-success': { status: boolean };
  'app-get-users': { data: User[] };
  // 'socket-msg': { message: Message };
  'msg-send': { message: Message };
  'msg-receive': { message: Message };
  'response-messeges': { messages: Message[] };
  'msg-read': { id: string; isReaded: boolean };
}
// Переписать на request-msg / response-auth...

interface UserListEvents {
  'list-input': { value: string };
  'list-user-active': { user: User };
}

interface ChatEvents {
  'chat-conversation': { user: User };
  'chat-msg': { text: string };
  'chat-change-read-status': { status: boolean };
}

export { LoginEvents, AppEvents, UserListEvents, ChatEvents };
