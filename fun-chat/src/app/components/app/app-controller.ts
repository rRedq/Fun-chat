import { LoginController } from '@components/login/login-controller';
import { ChatController } from '@components/chat/main-chat/chat-controller';
import { socketEmitter } from '@shared/const';
import { InfoPage } from '@components/info/info';
import { getStorage } from '@utils/storage';
import { UserData } from '@alltypes/common';
import { AppView } from './app-view';
import { AppModel } from './app-model';

export class AppController {
  private view: AppView = new AppView();

  private model: AppModel = new AppModel();

  private login: LoginController | undefined;

  private chat: ChatController | undefined;

  private info: InfoPage | undefined;

  private currentPage: 'login' | 'chat' | 'info' = 'login';

  constructor() {
    this.setSubscribers();
    this.createLoginPage();
  }

  private setSubscribers(): void {
    socketEmitter.subscribe('app-auth-success', ({ login }) => {
      if (this.currentPage === 'info') {
        this.createInfoPage('to');
      } else if (this.currentPage === 'login') {
        this.createChatPage(login);
      }
    });
    socketEmitter.subscribe('app-logout', () => this.model.userLogout());
    socketEmitter.subscribe('app-logout-success', () => {
      this.model.removeUser();
      this.createLoginPage();
    });
    socketEmitter.subscribe('open-socket', () => this.model.isAuth());
    socketEmitter.subscribe('click-info', ({ direction }) => this.createInfoPage(direction));
  }

  private createLoginPage(): void {
    this.clearApp();
    this.login = new LoginController();
    this.view.createLoginPage(this.login.getLoginViewRoot());
    this.currentPage = 'login';
  }

  private createChatPage(login: string): void {
    this.clearApp();
    this.chat = new ChatController(login);
    this.view.createChatPage(this.chat.getChatViewRoot());
    this.currentPage = 'chat';
  }

  private createInfoPage(direction: 'to' | 'from'): void {
    this.clearApp();
    this.currentPage = 'info';
    if (direction === 'to') {
      this.info = new InfoPage();
      this.view.createInfoPage(this.info.getRoot());
    } else if (direction === 'from') {
      const user: UserData | null = getStorage();
      if (user) {
        this.createChatPage(user.name);
      } else {
        this.createLoginPage();
      }
    }
  }

  private clearApp(): void {
    if (this.info) {
      this.info.removeInfoPage();
      this.info = undefined;
    } else if (this.chat) {
      this.chat.removeChat();
      this.chat = undefined;
    } else if (this.login) {
      this.login.removeLogin();
      this.login = undefined;
    }
  }
}
