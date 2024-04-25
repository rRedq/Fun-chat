import { main, section } from '@utils/index';

export class ChatView {
  private chat: HTMLDivElement;

  constructor(header: HTMLElement, list: HTMLElement, dialogue: HTMLElement, footer: HTMLElement) {
    const cover = section({ className: 'chat__main' }, list, dialogue);
    this.chat = main({ className: 'chat' }, header, cover, footer);
  }

  public removeRoot(): void {
    this.chat.remove();
  }

  public getRoot(): HTMLDivElement {
    return this.chat;
  }
}
