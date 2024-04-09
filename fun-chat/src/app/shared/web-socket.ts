import { AuthResponseError, AuthResponseSucces } from '@alltypes/serverResponse';
import { serverUrl } from './const';

export class RemoteServer {
  private webSocket = new WebSocket(serverUrl);

  constructor() {
    this.webSocket.onmessage = (event) => {
      console.log(event.data);
    };
  }

  public setAuth(id: string, login: string, password: string): Promise<AuthResponseSucces | AuthResponseError> {
    this.isOpen();

    const data = {
      id,
      type: 'USER_LOGIN',
      payload: {
        user: {
          login,
          password,
        },
      },
    };
    this.webSocket.send(JSON.stringify(data));

    return new Promise((resolve) => {
      this.webSocket.onmessage = (event) => {
        const result: AuthResponseSucces | AuthResponseError = JSON.parse(event.data);
        if (result.type === 'USER_LOGIN' || result.type === 'ERROR') {
          resolve(result);
        }
      };
    });
  }

  private isOpen(): boolean {
    if (this.webSocket.readyState === WebSocket.OPEN) {
      console.log('Соединение с WebSocket установлено');
    } else {
      console.log('Соединение с WebSocket не установлено');
    }
    return this.webSocket.readyState === WebSocket.OPEN;
  }
}
