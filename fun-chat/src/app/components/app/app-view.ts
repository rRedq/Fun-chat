import { div } from '@utils/tag-create-functions';

export class AppView {
  private app: HTMLDivElement;

  constructor() {
    this.app = div({ className: 'app' });
    document.body.append(this.app);
  }

  public createLoginPage(login: HTMLDivElement): void {
    this.app.replaceChildren();
    this.app.append(login);
  }

  public createChatPage(chat: HTMLDivElement): void {
    this.app.replaceChildren();
    this.app.append(chat);
  }
}
