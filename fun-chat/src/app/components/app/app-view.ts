import { div } from '@utils/index';

export class AppView {
  private app: HTMLDivElement;

  constructor() {
    this.app = div({ className: 'app' });
    document.body.append(this.app);
  }

  public createLoginPage(login: HTMLDivElement): void {
    this.app.append(login);
  }

  public createChatPage(chat: HTMLDivElement): void {
    this.app.append(chat);
  }

  public createInfoPage(info: HTMLDivElement): void {
    this.app.append(info);
  }

  public createErrorPage(error: HTMLDivElement): void {
    this.app.append(error);
  }
}
