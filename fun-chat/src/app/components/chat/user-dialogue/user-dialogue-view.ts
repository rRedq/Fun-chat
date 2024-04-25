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
    div({ className: 'dialogue__fill', textContent: 'Choose user for sending message...' })
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

  private placeholder: HTMLDivElement = div({ className: 'dialogue__fill', textContent: 'Send your first message...' });

  private status: HTMLDivElement = div({});

  private historyDivider: HTMLDivElement = div(
    { className: 'dialogue__history' },
    div({ className: 'dialogue__history-text', textContent: 'New messages' })
  );

  private cancelEditBtn = div({ className: 'dialogue__cancel', textContent: 'X' });

  private isHistoryDivider = false;

  private isScroll = false;

  private messageId = '';

  private conversation: MessageController[] = [];

  constructor(
    private chatEmitter: EventEmitter<ChatEvents>,
    private userName: string
  ) {
    this.form.addEventListener('submit', this.submitMessage);
    this.content.addEventListener('click', () => MessageView.removeMenu());
    this.cancelEditBtn.addEventListener('click', this.clearEditState);
    this.content.addEventListener('click', this.clickMesages);
    this.content.addEventListener('wheel', this.scrollMessages);
    this.msg.addEventListener('keyup', () => {
      if (this.msg.value.trim().length > 0) {
        this.btn.disabled = false;
      } else {
        this.btn.disabled = true;
      }
    });
  }

  private submitMessage = (e: Event): void => {
    e.preventDefault();
    MessageView.removeMenu();
    if (!this.messageId && this.msg.value.trim().length > 0) {
      this.chatEmitter.emit('chat-msg', { text: this.msg.value });
      this.chatEmitter.emit('chat-change-read-status', { status: true });
      this.isScroll = false;
      this.msg.value = '';
    } else if (this.messageId && this.msg.value.trim().length > 0) {
      this.chatEmitter.emit('change-msg-success', { id: this.messageId, text: this.msg.value });
      this.clearEditState();
    }
    this.clearHistoryDevider();
  };

  public editMessage(messageId: string, text: string): void {
    if (this.messageId !== messageId) {
      this.messageId = messageId;
      this.msg.value = text;
      this.msg.after(this.cancelEditBtn);
    }
  }

  public startDisalogue(user: User): void {
    this.remove();
    this.header.replaceChildren();
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
    if (!this.isHistoryDivider && !message.status.isReaded) {
      this.isHistoryDivider = true;
      this.content.prepend(this.historyDivider);
    }
    this.isScroll = true;
    const msg = new MessageController(this.chatEmitter, message, this.checkContentAfterDelete.bind(this));
    this.conversation.push(msg);
    this.addMessageToConversation(msg.addMessageByinterlocutor());
  }

  public addMessageByAuthor(message: Message): void {
    const msg = new MessageController(this.chatEmitter, message, this.checkContentAfterDelete.bind(this));
    this.conversation.push(msg);
    this.addMessageToConversation(msg.addMessageByAuthor());
  }

  private checkContentAfterDelete(): void {
    if (
      this.content.firstChild === this.historyDivider ||
      (this.content.children.length === 1 && this.content.lastChild === this.historyDivider)
    ) {
      this.clearHistoryDevider();
    }
    if (this.content.children.length === 0) {
      this.content.append(this.placeholder);
    }
  }

  private addMessageToConversation(cover: HTMLDivElement): void {
    this.placeholder.remove();
    this.content.prepend(cover);

    const heightGap = 230;

    if (this.isHistoryDivider) {
      this.content.scrollTop = this.historyDivider.offsetTop - heightGap;
    } else {
      this.content.scrollTop = this.content.scrollHeight;
    }
  }

  private scrollMessages = (): void => {
    if (this.isScroll) {
      this.chatEmitter.emit('chat-change-read-status', { status: true });
      this.clearHistoryDevider();
      this.isScroll = false;
    }
  };

  private clickMesages = (): void => {
    if (this.isScroll) {
      this.chatEmitter.emit('chat-change-read-status', { status: true });
      this.clearHistoryDevider();
      this.isScroll = false;
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
    this.clearEditState();
    this.isScroll = false;
    this.conversation.forEach((msg: MessageController) => msg.remove());
    this.conversation.length = 0;
    this.isHistoryDivider = false;
    this.historyDivider.remove();
  }

  public clearEditState = (): void => {
    this.msg.value = '';
    this.messageId = '';
    this.cancelEditBtn.remove();
    this.btn.disabled = true;
  };
}
