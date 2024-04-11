import { ResponseError, AuthResponse } from '@alltypes/serverResponse';
import { UserData } from '@alltypes/common';
import { socketDataContainer, serverUrl } from './const';

export class RemoteServer {
  private webSocket = new WebSocket(serverUrl);

  constructor() {
    this.webSocket.onmessage = (event) => {
      this.serverResponse(event.data);
    };
  }

  private serverResponse(data: AuthResponse | ResponseError): void {
    console.log(data);
  }

  public userLogout(userData: UserData) {
    return new Promise((resolve, reject) => {
      if (!this.isOpen()) {
        reject(new Error('server unavailable'));
      }

      const data = socketDataContainer(userData, 'USER_LOGOUT');
      this.webSocket.send(JSON.stringify(data));

      this.webSocket.onmessage = (event) => {
        const result: AuthResponse | ResponseError = JSON.parse(event.data);
        if (result.type === 'USER_LOGOUT') {
          resolve(result);
        } else if (result.type === 'ERROR') {
          reject(result.payload.error);
        }
      };
    });
  }

  public setAuth(userData: UserData): Promise<AuthResponse | ResponseError> {
    return new Promise((resolve, reject) => {
      if (!this.isOpen()) {
        reject(new Error('server unavailable'));
      }

      const data = socketDataContainer(userData, 'USER_LOGIN');
      this.webSocket.send(JSON.stringify(data));

      this.webSocket.onmessage = (event) => {
        const result: AuthResponse | ResponseError = JSON.parse(event.data);
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
