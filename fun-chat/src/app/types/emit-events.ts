import { LoginInputNames } from './common';

interface LoginEvents {
  'login-input': { value: string; name: LoginInputNames };
  'login-auth': { event: Event };
  'login-auth2': { event: string };
}

interface AppEvents {
  'app-auth': { login: string };
}

export { LoginEvents, AppEvents };
