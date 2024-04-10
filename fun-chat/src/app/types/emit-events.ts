import { LoginInputNames, UserData } from './common';

interface LoginEvents {
  'login-input': { value: string; name: LoginInputNames };
  'login-auth': { event: Event };
}

interface AppEvents {
  'app-auth': UserData;
  'app-logout': { status: boolean };
}

export { LoginEvents, AppEvents };
