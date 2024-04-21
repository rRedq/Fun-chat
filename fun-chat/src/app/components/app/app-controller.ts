import { LoginController } from '@components/login/login-controller';
import { EventEmitter } from '@shared/event-emitter';
import { AppEvents } from '@alltypes/emit-events';
import { ChatController } from '@components/chat/main-chat/chat-controller';
import { socketEmitter } from '@shared/const';
import { AppView } from './app-view';
import { AppModel } from './app-model';

export class AppController {
  private view: AppView = new AppView();

  private model: AppModel = new AppModel();

  private emitter: EventEmitter<AppEvents> = socketEmitter;

  constructor() {
    this.setSubscribers();
    this.createLoginPage();
  }

  private setSubscribers(): void {
    this.emitter.subscribe('app-auth-success', (data: { login: string }) => this.createChatPage(data.login));

    this.emitter.subscribe('app-logout', () => this.model.userLogout());

    this.emitter.subscribe('app-logout-success', () => {
      this.model.removeUser();
      this.createLoginPage();
    });
    socketEmitter.subscribe('open-socket', () => this.model.isAuth());
  }

  private createLoginPage(): void {
    const login: HTMLDivElement = new LoginController(this.emitter).getLoginViewRoot();
    this.view.createLoginPage(login);
  }

  private createChatPage(login: string): void {
    const chat: HTMLDivElement = new ChatController(this.emitter, login).getChatViewRoot();
    this.view.createChatPage(chat);
  }
}
