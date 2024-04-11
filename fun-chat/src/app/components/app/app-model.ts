import { UserData } from '@alltypes/common';
import { RemoteServer } from '@shared/web-socket';

export class AppModel {
  private webSocket: RemoteServer;

  private user: UserData = { id: '', name: '', password: '' };

  constructor(webSocket: RemoteServer) {
    this.webSocket = webSocket;
  }

  public init(success: (login: string) => void, fail: () => void): void {
    // заменить
    try {
      const a = sessionStorage.getItem('auth');
      if (a) {
        const b = JSON.parse(a);
        setTimeout(() => {
          const { id, name, password } = b;
          // const { name, password } = b;
          // const id = 'login';
          this.webSocket.setAuth({ id, name, password });
          success(b.name);
          this.setUserState({ id, name, password });
        }, 100);
      } else {
        fail();
      }
    } catch (error) {
      console.error(error);
    }
  }

  public setUserState({ id, name, password }: UserData): void {
    this.user = { id, name, password };
  }

  public userLogout(): void {
    this.webSocket
      .userLogout({ id: this.user.id, name: this.user.name, password: this.user.password })
      .then(() => {
        this.user = { id: '', name: '', password: '' };
        sessionStorage.removeItem('auth');
      })
      .catch((error: string) => console.error(error));
  }
}
