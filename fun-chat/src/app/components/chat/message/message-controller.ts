import { ChatEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { Message } from '@alltypes/serverResponse';
import { socketEmitter } from '@shared/const';
import { MessageView } from './message-view';
import { MessageModel } from './message-model';

export class MessageController {
  private subs: (() => void)[] = [];

  private view: MessageView;

  private model: MessageModel;

  constructor(
    private chatEmitter: EventEmitter<ChatEvents>,
    message: Message
  ) {
    this.view = new MessageView(this);
    this.model = new MessageModel(message);
    this.subs.push(
      socketEmitter.subscribe('response-change-msg', ({ response }) => {
        this.model.updateMessage(response, this.view.editMessage.bind(this.view));
      })
    );
  }

  public changeMessage = (): void => {
    this.chatEmitter.emit('change-msg', this.model.changeMessage());
  };

  public addMessageByAuthor(): HTMLDivElement {
    const unsubscribe = socketEmitter.subscribe('msg-read', ({ id, isReaded }) => {
      if (this.model.isRead(id)) {
        this.view.setStatus(false, isReaded);
        unsubscribe();
      }
    });
    this.subs.push(unsubscribe);

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
