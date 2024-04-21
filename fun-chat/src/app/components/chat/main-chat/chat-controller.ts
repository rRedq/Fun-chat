import './chat.scss';
import { ChatEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { socketEmitter } from '@shared/const';
import { ChatView } from './chat-view';
import { FooterView } from '../footer/footer-view';
import { UserListComtroller } from '../user-list/user-list-controller';
import { UserDialogueComtroller } from '../user-dialogue/user-dialogue-controller';
import { HeaderView } from '../header/header-view';

export class ChatController extends EventEmitter<ChatEvents> {
  private chatView: ChatView;

  private userList: UserListComtroller;

  private dialogue: UserDialogueComtroller;

  constructor(userName: string) {
    super();
    const header = new HeaderView(userName).getHeaderView();
    const footer = new FooterView().getRoot();
    this.userList = new UserListComtroller(userName, this);
    this.dialogue = new UserDialogueComtroller(this, userName);
    this.chatView = new ChatView(header, this.userList.getUserListView(), this.dialogue.getUserListView(), footer);
    const remove = socketEmitter.subscribe('app-logout-success', () => {
      this.removeChat();
      remove();
    });
  }

  public removeChat(): void {
    this.dialogue.removeDialogue();
    this.userList.removeUserList();
    this.chatView.removeRoot();
  }

  public getChatViewRoot(): HTMLDivElement {
    return this.chatView.getRoot();
  }
}
