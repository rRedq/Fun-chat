import { LoginInputNames } from './common';

interface LoginEvents {
  'login-input': { value: string; name: LoginInputNames };
  'login-auth': { event: Event };
}

interface AppEvents {
  'app-auth-success': { login: string };
  'app-auth-error': { error: string };
  'app-logout': { status: boolean };
  'app-logout-success': { status: boolean };
}

export { LoginEvents, AppEvents };
