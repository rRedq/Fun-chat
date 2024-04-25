import { LoginController } from '@components/login/login-controller';
import { ChatController } from '@components/chat/index';
import { socketEmitter } from '@shared/index';
import { InfoPage } from '@components/info/info';
import { getStorage } from '@utils/index';
import { UserData } from '@alltypes/common';
import { Router } from '@utils/router';
import { ErrorPage } from '@components/error-page/error';
import { AppView, AppModel } from '@components/app/index';

export class AppController {
  private view: AppView = new AppView();

  private model: AppModel = new AppModel();

  private login?: LoginController;

  private chat?: ChatController;

  private info?: InfoPage;

  private error?: ErrorPage;

  private router: Router = new Router(this.setPage.bind(this));

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
    this.router.setPath('login');
    this.login = new LoginController();
    this.view.createLoginPage(this.login.getLoginViewRoot());
    this.currentPage = 'login';
  }

  private createChatPage(login: string): void {
    this.clearApp();
    this.router.setPath('chat');
    this.chat = new ChatController(login);
    this.view.createChatPage(this.chat.getChatViewRoot());
    this.currentPage = 'chat';
  }

  private createInfoPage(direction: 'to' | 'from'): void {
    this.clearApp();
    this.router.setPath('info');
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

  public setPage(str: string): void {
    const user: UserData | null = getStorage();
    if (str === 'login') {
      if (!user) {
        this.createLoginPage();
      } else {
        this.createChatPage(user.name);
      }
    } else if (str === 'info') {
      this.createInfoPage('to');
    } else if (str === 'chat') {
      if (user) {
        this.createChatPage(user.name);
      } else {
        this.createLoginPage();
      }
    } else {
      this.createErrorPage();
    }
  }

  private createErrorPage(): void {
    this.clearApp();
    this.error = new ErrorPage();
    this.view.createErrorPage(this.error.getErrorPage());
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
    } else if (this.error) {
      this.error.remove();
      this.error = undefined;
    }
  }
}
