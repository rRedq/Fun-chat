import './chat.scss';
import { AppEvents, ChatEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { RemoteServer } from 'app/web-socket.ts/web-socket';
import { ChatView } from './chat-view';
import { FooterView } from '../footer/footer-view';
import { UserListComtroller } from '../user-list/user-list-controller';
import { UserDialogueComtroller } from '../user-dialogue/user-dialogue-controller';
import { HeaderView } from '../header/header-view';

export class ChatController extends EventEmitter<ChatEvents> {
  private chatView: ChatView;

  private userList: UserListComtroller;

  private dialogue: UserDialogueComtroller;

  constructor(
    private webSocket: RemoteServer,
    emitter: EventEmitter<AppEvents>,
    userName: string
  ) {
    super();
    const header = new HeaderView(emitter, userName, this.removeChat.bind(this)).getHeaderView();
    const footer = new FooterView().getRoot();
    this.userList = new UserListComtroller(emitter, userName, this);
    this.dialogue = new UserDialogueComtroller(emitter, this, userName);
    this.chatView = new ChatView(header, this.userList.getUserListView(), this.dialogue.getUserListView(), footer);
  }

  private removeChat(): void {
    this.dialogue.removeDialogue();
    this.userList.removeUserList();
    this.chatView.removeRoot();
  }

  public getChatViewRoot(): HTMLDivElement {
    return this.chatView.getRoot();
  }
}
