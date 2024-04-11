import { LoginController } from '@components/login/login-controller';
import { RemoteServer } from '@shared/web-socket';
import { EventEmitter } from '@shared/event-emitter';
import { AppEvents } from '@alltypes/emit-events';
import { ChatController } from '@components/chat/main-chat/chat-controller';
import { UserData } from '@alltypes/common';
import { AppView } from './app-view';
import { AppModel } from './app-model';

export class AppController extends EventEmitter<AppEvents> {
  private webSocket = new RemoteServer();

  private appView: AppView = new AppView();

  private appModel: AppModel = new AppModel(this.webSocket);

  constructor() {
    super();
    this.subscribe('app-auth', (data: UserData) => {
      this.createChatPage(data.name);
      this.appModel.setUserState(data);
    });
    this.subscribe('app-logout', () => {
      this.appModel.userLogout();
      this.createLoginPage();
    });
    this.appModel.init(this.createChatPage.bind(this), this.createLoginPage.bind(this));
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
