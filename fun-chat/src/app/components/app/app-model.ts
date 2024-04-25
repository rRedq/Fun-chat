import { UserData } from '@alltypes/common';
import { deleteStorageKey, getStorage } from '@utils/storage';
import { sendAuthentication } from '../../web-socket/socket-actions';

export class AppModel {
  public isAuth(): void {
    const user: UserData | null = getStorage();
    if (user) {
      sendAuthentication(user, 'USER_LOGIN');
    }
  }

  public userLogout(): void {
    const user: UserData | null = getStorage();
    if (user) {
      sendAuthentication(user, 'USER_LOGOUT');
    }
  }

  public removeUser(): void {
    deleteStorageKey();
  }
}
