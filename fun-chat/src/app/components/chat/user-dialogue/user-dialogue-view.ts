import { Message, User } from '@alltypes/serverResponse';
import './dialugue.scss';
import { button, div, form, input, p } from '@utils/tag-create-functions';
import { appendChildren } from '@utils/dom-helpers';
import { ChatEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';

export class UserDialogueView {
  private header: HTMLDivElement = div({ className: 'dialogue__header' });

  private content: HTMLDivElement = div(
    { className: 'dialogue__content' },
    div({ textContent: 'Choose user for sending message...' })
  );

  private msg: HTMLInputElement = input({
    className: 'dialogue__input',
    type: 'text',
    disabled: true,
    placeholder: 'Message...',
  });

  private btn: HTMLButtonElement = button({ className: 'dialogue__btn btn', textContent: 'Send' });

  private form: HTMLFormElement = form({ className: 'dialogue__form' }, this.msg, this.btn);

  private root: HTMLDivElement = div({ className: 'dialogue' }, this.header, this.content, this.form);

  private companion: string | undefined;

  constructor(chatEmitter: EventEmitter<ChatEvents>) {
    this.form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      if (this.msg.value.trim().length > 0 && this.companion) {
        chatEmitter.emit('chat-msg', { login: this.companion, text: this.msg.value });
        this.msg.value = '';
      }
    });
  }

  public startDisalogue(user: User, dialogue?: Message[]): void {
    if (dialogue) {
      this.createDialogue(dialogue);
    }
    this.header.replaceChildren();
    this.companion = user.login;
    this.msg.disabled = false;
    const name = div({ className: 'dialogue__name', textContent: `${user.login}` });
    const isOnline = user.isLogined ? 'online' : 'offline';
    const status = div({ className: `dialogue__status-${isOnline}`, textContent: isOnline });
    appendChildren(this.header, [name, status]);
  }

  private createDialogue(dialogue: Message[]): void {
    this.content.replaceChildren();
    if (dialogue.length > 0) {
      dialogue.forEach((message) => this.createMessageContainer(message));
    } else {
      this.content.append(div({ textContent: 'Send your first message...' }));
    }
  }

  private createMessageContainer(message: Message) {
    const text = p({ className: 'dialogue__text', textContent: message.text });
    const label = div({ textContent: 'you' });
    const time = div({
      textContent: new Date(message.datetime).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
    });
    const status = div({ className: 'dialogue__msg-status', textContent: 'delivered' });
    const msgHeader = div({ className: 'dialogue__msg-header' }, label, time);
    const msg = div({ className: 'dialogue__message' }, msgHeader, text, status);
    const cover = div({ className: 'dialogue__cover' }, msg);
    this.content.append(cover);
  }

  public getRoot(): HTMLDivElement {
    return this.root;
  }
}
