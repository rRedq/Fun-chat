import './chat.scss';
import { AppEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { RemoteServer } from '@shared/web-socket';
import { ChatView } from './chat-view';
import { FooterView } from '../footer/footer-view';
import { UserListComtroller } from '../user-list/user-list-controller';
import { UserDialogueComtroller } from '../user-dialogue/user-dialogue-controller';
import { HeaderView } from '../header/header-view';

export class ChatController {
  private webSocket: RemoteServer;

  private chatView: ChatView;

  private userList: UserListComtroller;

  constructor(webSocket: RemoteServer, emitter: EventEmitter<AppEvents>, userName: string) {
    this.webSocket = webSocket;
    const header = new HeaderView(emitter, userName, this.removeChat.bind(this)).getHeaderView();
    const footer = new FooterView().getRoot();
    this.userList = new UserListComtroller(emitter, userName);
    const userDialogue = new UserDialogueComtroller().getUserListView();
    this.chatView = new ChatView(header, this.userList.getUserListView(), userDialogue, footer);
    this.webSocket.getUsers();
  }

  private removeChat(): void {
    this.userList.removeUserList();
    this.chatView.removeRoot();
  }

  public getChatViewRoot(): HTMLDivElement {
    return this.chatView.getRoot();
  }
}
