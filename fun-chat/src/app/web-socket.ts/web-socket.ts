import { WebSocketResponse } from '@alltypes/serverResponse';
import { socketEmitter } from '@shared/const';
import { logIn, logOut, receiveMessage, sendMessage, messageIsRead } from './socket-responses';

export class RemoteServer {
  private webSocket: WebSocket;

  constructor(url: string) {
    this.webSocket = new WebSocket(url);
    this.webSocket.onmessage = (event) => {
      this.serverResponse(event.data);
    };
  }

  public async serverRequest(data: string): Promise<void> {
    const isConnect = await this.isConnection();
    if (!isConnect) return;
    this.webSocket.send(data);
  }

  private serverResponse(data: string): void {
    const response: WebSocketResponse = JSON.parse(data);
    console.log(response);

    if (response.id === 'USER_LOGIN') {
      logIn(response);
    } else if (response.type === 'USER_LOGOUT') {
      logOut(response);
    } else if (response.type === 'USER_ACTIVE') {
      socketEmitter.emit('users-get-active', { data: response.payload.users });
    } else if (response.type === 'USER_INACTIVE') {
      socketEmitter.emit('users-get-inactive', { data: response.payload.users });
    } else if (response.type === 'MSG_SEND') {
      if (response.id === 'MSG_SEND') {
        sendMessage(response);
      } else {
        receiveMessage(response);
      }
    } else if (response.id === 'MSG_HISTORY') {
      socketEmitter.emit('response-messeges', { messages: response.payload.messages });
    } else if (response.type === 'MSG_READ') {
      messageIsRead(response);
    } else if (response.type === 'USER_EXTERNAL_LOGIN') {
      socketEmitter.emit('user-login', { user: response.payload.user });
    } else if (response.type === 'USER_EXTERNAL_LOGOUT') {
      socketEmitter.emit('user-logout', { user: response.payload.user });
    } else if (response.type === 'MSG_EDIT') {
      socketEmitter.emit('response-change-msg', { response: response.payload.message });
    } else if (response.type === 'MSG_DELETE') {
      socketEmitter.emit('response-delete-msg', { id: response.payload.message.id });
    } else if (response.id === 'MSG_COUNT') {
      socketEmitter.emit('response-msg-count', { messages: response.payload.messages });
    } else if (response.type === 'ERROR') {
      console.error(response.id, response.payload.error);
    }
  }

  private async isConnection(): Promise<boolean> {
    try {
      return await this.connection();
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private connection(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.webSocket.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          resolve(true);
        }
      }, 50);
      this.webSocket.onerror = () => {
        reject(new Error('server unavailable'));
      };
    });
  }
}
