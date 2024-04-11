import './chat.scss';
import { AppEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { RemoteServer } from '@shared/web-socket';
import { HeaderView } from '../header/header-view';
import { ChatView } from './chat-view';
import { FooterView } from '../footer/footer-view';
import { UserListComtroller } from '../user-list/user-list-controller';
import { UserDialogueComtroller } from '../user-dialogue/user-dialogue-controller';

export class ChatController {
  private webSocket: RemoteServer;

  private chatView: ChatView;

  constructor(webSocket: RemoteServer, emitter: EventEmitter<AppEvents>, userName: string) {
    this.webSocket = webSocket;
    const header = new HeaderView(emitter, userName, this.removeChat.bind(this)).getHeaderView();
    const footer = new FooterView().getRoot();
    const userList = new UserListComtroller().getUserListView();
    const userDialogue = new UserDialogueComtroller().getUserListView();
    this.chatView = new ChatView(header, userList, userDialogue, footer);
  }

  private removeChat(): void {
    this.chatView.removeRoot();
  }

  public getChatViewRoot(): HTMLDivElement {
    return this.chatView.getRoot();
  }
}
