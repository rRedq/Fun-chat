import { AppEvents, ChatEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { RemoteServer } from '@shared/web-socket';
import { UserDialogueView } from './user-dialogue-view';
import { UserDialogueModel } from './user-dialogue-model';

export class UserDialogueComtroller {
  private view: UserDialogueView;

  private model: UserDialogueModel = new UserDialogueModel();

  private subs: (() => void)[] = [];

  constructor(
    private emitter: EventEmitter<AppEvents>,
    private chatEmitter: EventEmitter<ChatEvents>,
    private webSocket: RemoteServer
  ) {
    this.view = new UserDialogueView(chatEmitter);
    this.setSubscribers();
  }

  private setSubscribers(): void {
    this.subs.push(
      this.chatEmitter.subscribe('chat-conversation', ({ user }) => {
        this.model.setUser(user);
        this.model.getDialogueWithUser(this.view.startDisalogue.bind(this.view));
      })
    );
    this.subs.push(
      this.chatEmitter.subscribe('chat-msg', ({ login, text }) => this.webSocket.sendMessage(text, login))
    );
    this.subs.push(
      this.emitter.subscribe('socket-msg', ({ message }) =>
        this.model.getDialogueWithUser(this.view.startDisalogue.bind(this.view), message)
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
