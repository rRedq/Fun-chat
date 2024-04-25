import { ChatEvents } from '@alltypes/emit-events';
import { EventEmitter, socketEmitter } from '@shared/index';
import { Message } from '@alltypes/socketTypes';
import { MessageView, MessageModel } from '@components/chat/index';

export class MessageController {
  private subs: (() => void)[] = [];

  private view: MessageView;

  private model: MessageModel;

  constructor(
    private chatEmitter: EventEmitter<ChatEvents>,
    message: Message,
    callback: () => void
  ) {
    this.view = new MessageView(this);
    this.model = new MessageModel(message);
    this.setSubscribers();
    const unsunscribe = socketEmitter.subscribe('response-delete-msg', ({ id }) => {
      if (this.model.isCurrentMessage(id)) {
        this.view.removeMessage();
        callback();
        unsunscribe();
      }
    });
    this.subs.push(unsunscribe);
  }

  private setSubscribers(): void {
    this.subs.push(
      socketEmitter.subscribe('response-change-msg', ({ response }) => {
        this.model.updateMessage(response, this.view.editMessage.bind(this.view));
      })
    );
  }

  public changeMessage = (): void => {
    this.chatEmitter.emit('change-msg', this.model.changeMessage());
  };

  public deleteMessage = (): void => {
    this.model.deleteMessage();
  };

  public addMessageByAuthor(): HTMLDivElement {
    if (!this.model.getMessageStatus().isReaded) {
      const unsubscribe = socketEmitter.subscribe('msg-read', ({ id, isReaded }) => {
        if (this.model.isCurrentMessage(id)) {
          this.view.setStatus(false, isReaded);
          unsubscribe();
        }
      });
      this.subs.push(unsubscribe);
    }
    if (!this.model.getMessageStatus().isDelivered) {
      const unsubscribe = socketEmitter.subscribe('response-msg-deliver', ({ response }) => {
        if (this.model.isCurrentMessage(response.id)) {
          this.view.setStatus(response.status.isDelivered);
          unsubscribe();
        }
      });
      this.subs.push(unsubscribe);
    }

    return this.view.addMessageByAuthor(this.model.getMessage());
  }

  public addMessageByinterlocutor(): HTMLDivElement {
    return this.view.addMessageByinterlocutor(this.model.getMessage());
  }

  public getView(): HTMLDivElement {
    return this.view.getRoot();
  }

  public remove(): void {
    this.view.removeMessage();
    this.subs.forEach((unsubscribe: () => void) => unsubscribe());
  }
}
