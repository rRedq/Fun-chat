import { ResponseError, AuthResponse, ResponseAuthenticationList } from '@alltypes/serverResponse';
import { UserData } from '@alltypes/common';
import { authenticationData } from '@utils/socket-data-containers';
import { AppEvents } from '@alltypes/emit-events';
import { serverUrl } from './const';
import { EventEmitter } from './event-emitter';

export class RemoteServer {
  private webSocket = new WebSocket(serverUrl);

  private emitter: EventEmitter<AppEvents>;

  constructor(emitter: EventEmitter<AppEvents>) {
    this.emitter = emitter;
    this.webSocket.onmessage = (event) => {
      this.serverResponse(event.data);
    };
  }

  private serverResponse(data: string): void {
    const response: AuthResponse | ResponseError = JSON.parse(data);
    console.log(response);
    if (response.id === 'USER_LOGIN') {
      this.login(response);
    } else if (response.id === 'USER_LOGOUT') {
      this.logout(response);
    }
  }

  private login(response: AuthResponse | ResponseError): void {
    if (response.type === 'USER_LOGIN') {
      this.emitter.emit('app-auth-success', { login: response.payload.user.login });
    } else if (response.type === 'ERROR') {
      this.emitter.emit('app-auth-error', { error: response.payload.error });
    }
  }

  private logout(response: AuthResponse | ResponseError): void {
    if (response.type === 'USER_LOGOUT') {
      this.emitter.emit('app-logout-success', { status: true });
    } else if (response.type === 'ERROR') {
      console.error(response.payload.error);
    }
  }

  public async sendAuthentication(userData: UserData, type: ResponseAuthenticationList) {
    try {
      await this.connection();

      const data = authenticationData(userData, type);
      this.webSocket.send(JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  }

  private connection(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.webSocket.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          resolve(true);
        }
      });
      this.webSocket.onerror = () => {
        reject(new Error('server unavailable'));
      };
    });
  }
}
