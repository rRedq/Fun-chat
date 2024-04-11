import { UserData } from '@alltypes/common';
import { RemoteServer } from '@shared/web-socket';
import { deleteStorageKey, getStorage } from '@utils/storage';

export class AppModel {
  private webSocket: RemoteServer;

  private user: UserData = { name: '', password: '' };

  constructor(webSocket: RemoteServer) {
    this.webSocket = webSocket;
  }

  public init(login: () => void) {
    const user: UserData | null = getStorage();
    if (user) {
      this.user.name = user.name;
      this.user.password = user.password;
      this.webSocket.sendAuthentication(user, 'USER_LOGIN');
    } else {
      login();
    }
  }

  public setUserState(): void {
    // setTimeout(() => {
    const user: UserData | null = getStorage();
    if (user) {
      this.user.name = user.name;
      this.user.password = user.password;
    }
    // }, 10);
  }

  public userLogout(): void {
    this.webSocket.sendAuthentication(this.user, 'USER_LOGOUT');
  }

  public removeUser(): void {
    this.user.name = '';
    this.user.password = '';
    deleteStorageKey();
  }
}
