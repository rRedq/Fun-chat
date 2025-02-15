import { WebSocketResponse } from '@alltypes/socketTypes';
import { socketEmitter } from '@shared/const';
import { Modal } from '@components/modal/modal';
import { EnumResponses } from '@alltypes/enum';
import { logIn, logOut } from './socket-responses';

export class RemoteServer {
  private webSocket: WebSocket;

  private socketConnection = false;

  constructor(private url: string) {
    this.webSocket = new WebSocket(url);
    this.webSocket.addEventListener('open', () => {
      this.socketConnection = true;
      socketEmitter.emit('open-socket', { status: true });
    });
    this.addSocketEventListeners();
  }

  private addSocketEventListeners(): void {
    this.webSocket.addEventListener('message', this.serverResponse);
    this.webSocket.addEventListener('close', this.onClose);
  }

  private removeSocketEventListeners(): void {
    this.webSocket.addEventListener('message', this.serverResponse);
    this.webSocket.addEventListener('close', this.onClose);
  }

  private onClose = (): void => {
    this.removeSocketEventListeners();
    const errorModal = new Modal();
    errorModal.createReconnectModal();

    const timeToAnotherCheck = 4000;
    const interval = setInterval(async () => {
      this.webSocket = new WebSocket(this.url);
      const response = await this.connection();

      if (response) {
        errorModal.closeModal();
        this.addSocketEventListeners();
        clearInterval(interval);
        socketEmitter.emit('open-socket', { status: true });
      }
    }, timeToAnotherCheck);
  };

  public serverRequest(data: string): void {
    if (this.socketConnection) {
      this.webSocket.send(data);
    }
  }

  private serverResponse(event: MessageEvent<string>): void {
    const response: WebSocketResponse = JSON.parse(event.data);
    if (response.id === EnumResponses.login) {
      logIn(response);
    } else if (response.type === EnumResponses.logout) {
      logOut(response);
    } else if (response.type === EnumResponses.active) {
      socketEmitter.emit('users-get-active', { data: response.payload.users });
    } else if (response.type === EnumResponses.inactive) {
      socketEmitter.emit('users-get-inactive', { data: response.payload.users });
    } else if (response.type === EnumResponses.send) {
      if (response.id === EnumResponses.send) {
        socketEmitter.emit('msg-send', { message: response.payload.message });
      } else {
        socketEmitter.emit('msg-receive', { message: response.payload.message });
      }
    } else if (response.id === EnumResponses.history) {
      socketEmitter.emit('response-messeges', { messages: response.payload.messages });
    } else if (response.type === EnumResponses.read) {
      socketEmitter.emit('msg-read', {
        id: response.payload.message.id,
        isReaded: response.payload.message.status.isReaded,
      });
    } else if (response.type === EnumResponses.externalLogin) {
      socketEmitter.emit('user-login', { user: response.payload.user });
    } else if (response.type === EnumResponses.externalLogout) {
      socketEmitter.emit('user-logout', { user: response.payload.user });
    } else if (response.type === EnumResponses.edit) {
      socketEmitter.emit('response-change-msg', { response: response.payload.message });
    } else if (response.type === EnumResponses.delete) {
      socketEmitter.emit('response-delete-msg', { id: response.payload.message.id });
    } else if (response.id === EnumResponses.count) {
      socketEmitter.emit('response-msg-count', { messages: response.payload.messages });
    } else if (response.type === EnumResponses.deliver) {
      socketEmitter.emit('response-msg-deliver', { response: response.payload.message });
    } else if (response.type === EnumResponses.error) {
      console.error(response.id, response.payload.error);
    }
  }

  private connection(): Promise<boolean> {
    return new Promise((resolve) => {
      const timeIntervalToCheck = 50;
      const interval = setInterval(() => {
        if (this.webSocket.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          this.socketConnection = true;
          resolve(true);
        } else {
          this.socketConnection = false;
          resolve(false);
        }
      }, timeIntervalToCheck);
    });
  }
}
