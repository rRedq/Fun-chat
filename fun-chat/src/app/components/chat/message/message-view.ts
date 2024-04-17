import { ChatEvents } from '@alltypes/emit-events';
import { Message } from '@alltypes/serverResponse';
import { socketEmitter } from '@shared/const';
import { EventEmitter } from '@shared/event-emitter';
import { div, p } from '@utils/tag-create-functions';

export class MessageView {
  private subs: (() => void)[] = [];

  private message: HTMLDivElement = div({ className: 'dialogue__cover' });

  private text = p({ className: 'dialogue__text' });

  private menu = div({ className: 'menu' });

  constructor(private chatEmitter: EventEmitter<ChatEvents>) {
    this.menu.style.position = 'absolute';
    this.menu.textContent = 'Edit';
    this.menu.style.background = '#f00';
    // this.message.addEventListener('contextmenu', this.click);
  }

  private click = (e: MouseEvent): void => {
    e.preventDefault();
    console.log(e.pageX);
    this.menu.style.left = `50%`;
    this.menu.style.top = `20%`;
    this.message.appendChild(this.menu);
  };

  public addMessageByinterlocutor(message: Message): HTMLDivElement {
    const author: string = message.from;
    const msgType = 'dialogue__message-from';
    const msgStatus = '';
    const status = div({
      className: 'dialogue__msg-status',
      textContent: msgStatus,
    });
    return this.addMessageToConversation(message, { author, msgType, status });
  }

  public addMessageByAuthor(message: Message): HTMLDivElement {
    const author = 'you';
    const msgType = 'dialogue__message-to';
    const msgStatus = this.setStatus(message.status.isDelivered, message.status.isReaded);
    const status = div({
      className: 'dialogue__msg-status',
      textContent: msgStatus,
    });

    if (!message.status.isReaded) {
      const subscribe = socketEmitter.subscribe('msg-read', ({ id, isReaded }) => {
        if (message.id === id) {
          const newMsgStatus = this.setStatus(false, isReaded);
          status.textContent = newMsgStatus;
          subscribe();
        }
      });
      this.subs.push(subscribe);
    }

    return this.addMessageToConversation(message, { author, msgType, status });
  }

  private addMessageToConversation(
    message: Message,
    { author, msgType, status }: { author: string; msgType: string; status: HTMLDivElement }
  ): HTMLDivElement {
    this.text.textContent = message.text;
    const label = div({ textContent: author });
    const time = div({
      textContent: new Date(message.datetime).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
    });
    const msgHeader = div({ className: 'dialogue__msg-header' }, label, time);
    const msg = div({ className: msgType }, msgHeader, this.text, status);
    msg.addEventListener('contextmenu', this.click);

    this.message.append(msg);
    return this.message;
  }

  private setStatus(isDelivered?: boolean, isReaded?: boolean): string {
    let statusStr: string;
    if (isReaded) {
      statusStr = 'read';
    } else if (isDelivered) {
      statusStr = 'delivered';
    } else {
      statusStr = 'sent';
    }
    return statusStr;
  }

  public removeMessage(): void {
    this.message.remove();
    this.subs.forEach((unsubscribe) => unsubscribe());
  }
}
