import { Message, User } from '@alltypes/serverResponse';
import './dialugue.scss';
import { button, div, form, input } from '@utils/tag-create-functions';
import { appendChildren } from '@utils/dom-helpers';
import { ChatEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { MessageView } from '../message/message-view';

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

  private placeholder: HTMLDivElement = div({ textContent: 'Send your first message...' });

  private status: HTMLDivElement = div({});

  private autoScroll = false;

  private messages: MessageView[] = [];

  constructor(
    private chatEmitter: EventEmitter<ChatEvents>,
    private userName: string
  ) {
    this.form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      if (this.msg.value.trim().length > 0) {
        this.chatEmitter.emit('chat-msg', { text: this.msg.value });
        this.chatEmitter.emit('chat-change-read-status', { status: true });
        this.removeIsReadListeners();
      }
      this.msg.value = '';
    });
  }

  public startDisalogue(user: User): void {
    this.header.replaceChildren();
    this.messages.forEach((message) => message.removeMessage());
    this.msg.disabled = false;
    const name = div({ className: 'dialogue__name', textContent: `${user.login}` });
    const isOnline = user.isLogined ? 'online' : 'offline';
    this.status = div({ className: `dialogue__status-${isOnline}`, textContent: isOnline });
    appendChildren(this.header, [name, this.status]);
  }

  public updateUserStatus(status: boolean): void {
    const newStatus = status ? 'online' : 'offline';
    this.status.textContent = newStatus;
    this.status.className = '';
    this.status.classList.add(`dialogue__status-${newStatus}`);
  }

  public createDialogue(dialogue: Message[]): void {
    this.content.replaceChildren();
    if (dialogue.length > 0) {
      dialogue.forEach((message) => {
        if (message.from === this.userName) {
          this.addMessageByAuthor(message);
        } else {
          this.addMessageByinterlocutor(message);
        }
      });
    } else {
      this.content.append(this.placeholder);
    }
  }

  public addMessageByinterlocutor(message: Message): void {
    const msg = new MessageView(this.chatEmitter);
    this.messages.push(msg);
    this.addMessageToConversation(msg.addMessageByinterlocutor(message));
  }

  public addMessageByAuthor(message: Message): void {
    const msg = new MessageView(this.chatEmitter);
    this.messages.push(msg);
    this.addMessageToConversation(msg.addMessageByAuthor(message));
  }

  private addMessageToConversation(cover: HTMLDivElement): void {
    this.placeholder.remove();

    this.content.append(cover);

    this.autoScroll = true;
    this.content.scrollTop = this.content.scrollHeight;
    requestAnimationFrame(() => {
      this.autoScroll = false;
    });

    this.addIsReadListeners();
  }

  private addIsReadListeners(): void {
    this.content.addEventListener('scroll', this.scrollMessages);
    this.content.addEventListener('click', this.clickMesages);
  }

  private removeIsReadListeners(): void {
    this.content.removeEventListener('scroll', this.scrollMessages);
    this.content.removeEventListener('click', this.clickMesages);
  }

  private clickMesages = (): void => {
    this.chatEmitter.emit('chat-change-read-status', { status: true });
    this.removeIsReadListeners();
  };

  private scrollMessages = (): void => {
    if (!this.autoScroll) {
      this.chatEmitter.emit('chat-change-read-status', { status: true });
      this.removeIsReadListeners();
    }
  };

  public getRoot(): HTMLDivElement {
    return this.root;
  }
}
