import { Message, User } from '@alltypes/serverResponse';
import './dialugue.scss';
import { button, div, form, input } from '@utils/tag-create-functions';
import { appendChildren } from '@utils/dom-helpers';
import { ChatEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { MessageController } from '../message/message-controller';
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

  private btn: HTMLButtonElement = button({ className: 'dialogue__btn btn', textContent: 'Send', disabled: true });

  private form: HTMLFormElement = form({ className: 'dialogue__form' }, this.msg, this.btn);

  private root: HTMLDivElement = div({ className: 'dialogue' }, this.header, this.content, this.form);

  private placeholder: HTMLDivElement = div({ textContent: 'Send your first message...' });

  private status: HTMLDivElement = div({});

  private historyDivider: HTMLDivElement = div(
    { className: 'dialogue__history' },
    div({ className: 'dialogue__history-text', textContent: 'New messages' })
  );

  private isHistoryDivider = false;

  private autoScroll = false;

  private messageId = '';

  private conversation: MessageController[] = [];

  constructor(
    private chatEmitter: EventEmitter<ChatEvents>,
    private userName: string
  ) {
    this.form.addEventListener('submit', this.submitMessage);
    this.content.addEventListener('click', () => MessageView.removeMenu());
  }

  private submitMessage = (e: Event): void => {
    e.preventDefault();
    if (!this.messageId && this.msg.value.trim().length > 0) {
      this.chatEmitter.emit('chat-msg', { text: this.msg.value });
      this.chatEmitter.emit('chat-change-read-status', { status: true });
      this.removeIsReadListeners();
      this.msg.value = '';
    } else if (this.messageId && this.msg.value.trim().length > 0) {
      this.chatEmitter.emit('change-msg-success', { id: this.messageId, text: this.msg.value });
      this.messageId = '';
      this.msg.value = '';
    }
    this.clearHistoryDevider();
  };

  public editMessage(messageId: string, text: string): void {
    if (this.messageId !== messageId) {
      this.messageId = messageId;
      this.msg.value = text;
    }
  }

  public startDisalogue(user: User): void {
    this.remove();
    this.header.replaceChildren();
    this.msg.disabled = false;
    this.btn.disabled = false;
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
    if (!this.isHistoryDivider && !message.status.isReaded) {
      this.isHistoryDivider = true;
      this.content.append(this.historyDivider);
    }
    const msg = new MessageController(this.chatEmitter, message);
    this.conversation.push(msg);
    this.addMessageToConversation(msg.addMessageByinterlocutor());
  }

  public addMessageByAuthor(message: Message): void {
    const msg = new MessageController(this.chatEmitter, message);
    this.conversation.push(msg);
    this.addMessageToConversation(msg.addMessageByAuthor());
  }

  private addMessageToConversation(cover: HTMLDivElement): void {
    this.placeholder.remove();

    this.content.append(cover);

    this.autoScroll = true;
    const heightGap = 230;

    if (this.isHistoryDivider) {
      this.content.scrollTop = this.historyDivider.offsetTop - heightGap;
    } else {
      this.content.scrollTop = this.content.scrollHeight;
    }

    const timeToAnotherHeightCheck = 500;
    let scrollPosition = this.content.scrollTop;
    const scrollCheckInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        if (this.content.scrollTop === scrollPosition) {
          requestAnimationFrame(() => {
            this.autoScroll = false;
          });
          clearInterval(scrollCheckInterval);
        } else {
          scrollPosition = this.content.scrollTop;
        }
      }
    }, timeToAnotherHeightCheck);
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
    this.clearHistoryDevider();
    this.removeIsReadListeners();
  };

  private scrollMessages = (): void => {
    console.log(!this.autoScroll);
    if (!this.autoScroll) {
      this.chatEmitter.emit('chat-change-read-status', { status: true });
      this.clearHistoryDevider();
      this.removeIsReadListeners();
    }
  };

  public getRoot(): HTMLDivElement {
    return this.root;
  }

  private clearHistoryDevider(): void {
    this.isHistoryDivider = false;
    this.historyDivider.remove();
    this.content.scrollTop = this.content.scrollHeight;
  }

  public remove(): void {
    this.clear();
    this.autoScroll = true;
    this.conversation.forEach((msg: MessageController) => msg.remove());
    this.conversation.length = 0;
    this.isHistoryDivider = false;
    this.historyDivider.remove();
  }

  public clear(): void {
    this.msg.value = '';
    this.messageId = '';
  }
}
