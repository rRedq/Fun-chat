import { ChatEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { socketEmitter } from '@shared/const';
import { UserDialogueView } from './user-dialogue-view';
import { UserDialogueModel } from './user-dialogue-model';
import { editMsg } from '../../../web-socket.ts/socket-actions';

export class UserDialogueComtroller {
  private view: UserDialogueView;

  private model: UserDialogueModel;

  private subs: (() => void)[] = [];

  constructor(
    private chatEmitter: EventEmitter<ChatEvents>,
    userName: string
  ) {
    this.view = new UserDialogueView(chatEmitter, userName);
    this.model = new UserDialogueModel(userName);
    this.setChatSubscribers();
    this.setSubscribers();
  }

  private setChatSubscribers(): void {
    this.subs.push(
      this.chatEmitter.subscribe('chat-conversation', ({ user }) => {
        this.view.startDisalogue(user);
        this.model.setInterlocutor(user.login);
      })
    );
    this.subs.push(this.chatEmitter.subscribe('chat-msg', ({ text }) => this.model.sendMessage(text)));
    this.subs.push(
      this.chatEmitter.subscribe('chat-change-read-status', ({ status }) => this.model.changeReadStatus(status))
    );
    this.subs.push(this.chatEmitter.subscribe('change-msg', ({ id, text }) => this.view.editMessage(id, text)));
    this.subs.push(this.chatEmitter.subscribe('change-msg-success', ({ id, text }) => editMsg(id, text)));
  }

  private setSubscribers(): void {
    this.subs.push(socketEmitter.subscribe('msg-send', ({ message }) => this.view.addMessageByAuthor(message)));
    this.subs.push(
      socketEmitter.subscribe('msg-receive', ({ message }) =>
        this.model.isCurrentConversation(message, this.view.addMessageByinterlocutor.bind(this.view))
      )
    );
    this.subs.push(
      socketEmitter.subscribe('response-messeges', ({ messages }) =>
        this.model.getCurrentConversation(messages, this.view.createDialogue.bind(this.view))
      )
    );
    this.subs.push(
      socketEmitter.subscribe('user-login', ({ user }) =>
        this.model.isInterlocutor(user, this.view.updateUserStatus.bind(this.view))
      )
    );
    this.subs.push(
      socketEmitter.subscribe('user-logout', ({ user }) =>
        this.model.isInterlocutor(user, this.view.updateUserStatus.bind(this.view))
      )
    );
    this.subs.push(socketEmitter.subscribe('response-delete-msg', () => this.view.clear()));
  }

  public getUserListView(): HTMLDivElement {
    return this.view.getRoot();
  }

  public removeDialogue(): void {
    this.view.remove();
    this.subs.forEach((unsubscribe: () => void) => unsubscribe());
  }
}
