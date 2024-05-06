import './message.scss';
import { Message } from '@alltypes/socketTypes';
import { div, p, appendChildren } from '@utils/index';
import { type MessageController } from './message-controller';

type MsgAuthorAndType = { author: string; msgType: string };

export class MessageView {
  private message: HTMLDivElement = div({ className: 'dialogue__cover' });

  private text: HTMLParagraphElement = p({ className: 'dialogue__text' });

  private status: HTMLDivElement = div({
    className: 'dialogue__msg-status',
  });

  private edit: HTMLDivElement = div({
    className: 'dialogue__msg-status',
  });

  private static menu = div({ className: 'menu' });

  constructor(private controller: MessageController) {}

  private clickMenu = (e: MouseEvent): void => {
    e.preventDefault();
    MessageView.menu.replaceChildren();
    const changeMsg = div({ className: 'menu__item', textContent: 'change' });
    const deleteMsg = div({ className: 'menu__item', textContent: 'delete' });
    appendChildren(MessageView.menu, [changeMsg, deleteMsg]);
    changeMsg.addEventListener('click', this.controller.changeMessage);
    deleteMsg.addEventListener('click', this.controller.deleteMessage);
    this.message.append(MessageView.menu);
  };

  public editMessage(text: string, isEdited: boolean): void {
    this.setStatus(false, false, isEdited);
    this.text.textContent = text;
  }

  public static removeMenu(): void {
    MessageView.menu.remove();
  }

  public addMessageByinterlocutor(message: Message): HTMLDivElement {
    const author: string = message.from;
    const msgType = 'dialogue__message-from';
    this.status.textContent = '';
    this.setStatus(false, false, message.status.isEdited);

    return this.addMessageToConversation(message, { author, msgType });
  }

  public addMessageByAuthor(message: Message): HTMLDivElement {
    const author = 'you';
    const msgType = 'dialogue__message-to';
    this.status.textContent = 'sent';
    this.setStatus(message.status.isDelivered, message.status.isReaded, message.status.isEdited);
    return this.addMessageToConversation(message, { author, msgType });
  }

  private addMessageToConversation(message: Message, { author, msgType }: MsgAuthorAndType): HTMLDivElement {
    this.text.textContent = message.text;
    const label = div({ className: 'label', textContent: author });
    const time = div({
      textContent: new Date(message.datetime).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
    });
    const msgHeader = div({ className: 'dialogue__msg-header' }, label, time);
    const container = div({ className: 'statuses' }, this.edit, this.status);
    const msg = div({ className: msgType }, msgHeader, this.text, container);
    if (msgType === 'dialogue__message-to') {
      msg.addEventListener('contextmenu', this.clickMenu);
    }
    this.message.append(msg);
    return this.message;
  }

  public setStatus(isDelivered = false, isReaded = false, isEdited = false): void {
    if (isReaded) {
      this.status.textContent = 'read';
    } else if (isDelivered) {
      this.status.textContent = 'delivered';
    }

    if (isEdited) {
      this.edit.textContent = 'edited';
    }
  }

  public getRoot(): HTMLDivElement {
    return this.message;
  }

  public removeMessage(): void {
    this.message.remove();
  }
}
