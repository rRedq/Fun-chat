import { UserData } from '@alltypes/common';
import { RemoteServer } from 'app/web-socket.ts/web-socket';
import { deleteStorageKey, getStorage } from '@utils/storage';
import { sendAuthentication } from '../../web-socket.ts/socket-actions';

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
      sendAuthentication(user, 'USER_LOGIN');
    } else {
      login();
    }
  }

  public setUserState(): void {
    const user: UserData | null = getStorage();
    if (user) {
      this.user.name = user.name;
      this.user.password = user.password;
    }
  }

  public userLogout(): void {
    sendAuthentication(this.user, 'USER_LOGOUT');
  }

  public removeUser(): void {
    this.user.name = '';
    this.user.password = '';
    deleteStorageKey();
  }
}
