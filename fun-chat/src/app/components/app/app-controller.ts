import { LoginController } from '@components/login/login-controller';
import { RemoteServer } from '@shared/web-socket';
import { EventEmitter } from '@shared/event-emitter';
import { AppEvents } from '@alltypes/emit-events';
import { ChatController } from '@components/chat/main-chat/chat-controller';
import { AppView } from './app-view';
import { AppModel } from './app-model';

export class AppController extends EventEmitter<AppEvents> {
  private webSocket = new RemoteServer(this);

  private appView: AppView = new AppView();

  private appModel: AppModel = new AppModel(this.webSocket);

  constructor() {
    super();
    this.appModel.init(this.createLoginPage.bind(this));
    this.setSubscribers();
  }

  private setSubscribers(): void {
    this.subscribe('app-auth-success', (data: { login: string }) => {
      this.createChatPage(data.login);
      this.appModel.setUserState();
    });

    this.subscribe('app-logout', () => this.appModel.userLogout());

    this.subscribe('app-logout-success', () => {
      this.appModel.removeUser();
      this.createLoginPage();
    });
  }

  private createLoginPage(): void {
    const login: HTMLDivElement = new LoginController(this.webSocket, this).getLoginViewRoot();
    this.appView.createLoginPage(login);
  }

  private createChatPage(login: string): void {
    const chat: HTMLDivElement = new ChatController(this.webSocket, this, login).getChatViewRoot();
    this.appView.createChatPage(chat);
  }
}
