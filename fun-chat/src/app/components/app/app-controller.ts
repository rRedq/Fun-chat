import { LoginController } from '@components/login/login-controller';
import { RemoteServer } from 'app/web-socket.ts/web-socket';
import { EventEmitter } from '@shared/event-emitter';
import { AppEvents } from '@alltypes/emit-events';
import { ChatController } from '@components/chat/main-chat/chat-controller';
import { socketEmitter } from '@shared/const';
import { webSocket } from '../../web-socket.ts/socket-actions';
import { AppView } from './app-view';
import { AppModel } from './app-model';

export class AppController {
  private webSocket: RemoteServer = webSocket;

  private appView: AppView = new AppView();

  private appModel: AppModel = new AppModel(this.webSocket);

  private emitter: EventEmitter<AppEvents> = socketEmitter;

  constructor() {
    this.appModel.init(this.createLoginPage.bind(this));
    this.setSubscribers();
  }

  private setSubscribers(): void {
    this.emitter.subscribe('app-auth-success', (data: { login: string }) => {
      this.createChatPage(data.login);
      this.appModel.setUserState();
    });

    this.emitter.subscribe('app-logout', () => this.appModel.userLogout());

    this.emitter.subscribe('app-logout-success', () => {
      this.appModel.removeUser();
      this.createLoginPage();
    });
  }

  private createLoginPage(): void {
    const login: HTMLDivElement = new LoginController(this.webSocket, this.emitter).getLoginViewRoot();
    this.appView.createLoginPage(login);
  }

  private createChatPage(login: string): void {
    const chat: HTMLDivElement = new ChatController(this.webSocket, this.emitter, login).getChatViewRoot();
    this.appView.createChatPage(chat);
  }
}
