import { UserData } from '@alltypes/common';
import { deleteStorageKey, getStorage } from '@utils/index';
import { sendAuthentication } from '@socket/index';
import { EnumResponses } from '@alltypes/enum';

export class AppModel {
  public isAuth(): void {
    const user: UserData | null = getStorage();
    if (user) {
      sendAuthentication(user, EnumResponses.login);
    }
  }

  public userLogout(): void {
    const user: UserData | null = getStorage();
    if (user) {
      sendAuthentication(user, EnumResponses.logout);
    }
  }

  public removeUser(): void {
    deleteStorageKey();
  }
}
