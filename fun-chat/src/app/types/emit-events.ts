import { LoginInputNames } from './common';
import { User } from './serverResponse';

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
}

interface UserListEvents {
  'list-input': { value: string };
}

export { LoginEvents, AppEvents, UserListEvents };
