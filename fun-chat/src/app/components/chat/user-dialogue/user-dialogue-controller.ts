import { AppEvents, ChatEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { socketEmitter } from '@shared/const';
import { RemoteServer } from 'app/web-socket.ts/web-socket';
import { UserDialogueView } from './user-dialogue-view';
import { UserDialogueModel } from './user-dialogue-model';

export class UserDialogueComtroller {
  private view: UserDialogueView;

  private model: UserDialogueModel;

  private subs: (() => void)[] = [];

  constructor(
    private emitter: EventEmitter<AppEvents>,
    private chatEmitter: EventEmitter<ChatEvents>,
    private webSocket: RemoteServer,
    userName: string
  ) {
    this.view = new UserDialogueView(chatEmitter, userName);
    this.model = new UserDialogueModel(userName);
    this.setSubscribers();
  }

  private setSubscribers(): void {
    this.subs.push(
      this.chatEmitter.subscribe('chat-conversation', ({ user }) => {
        this.view.startDisalogue(user);
        this.model.setInterlocutor(user.login);
      })
    );
    this.subs.push(this.chatEmitter.subscribe('chat-msg', ({ text }) => this.model.sendMessage(text)));
    this.subs.push(this.emitter.subscribe('msg-send', ({ message }) => this.view.addMessageByAuthor(message)));
    this.subs.push(
      this.emitter.subscribe('msg-receive', ({ message }) =>
        this.model.isCurrentConversation(message, this.view.addMessageByinterlocutor.bind(this.view))
      )
    );
    this.subs.push(
      this.emitter.subscribe('response-messeges', ({ messages }) =>
        this.model.getCurrentConversation(messages, this.view.createDialogue.bind(this.view))
      )
    );
    this.subs.push(
      this.chatEmitter.subscribe('chat-change-read-status', ({ status }) => this.model.changeReadStatus(status))
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
  }

  public getUserListView(): HTMLDivElement {
    return this.view.getRoot();
  }

  public removeDialogue(): void {
    this.subs.forEach((unsubscribe: () => void) => unsubscribe());
  }
}
