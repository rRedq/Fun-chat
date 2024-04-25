import './chat.scss';
import { ChatEvents } from '@alltypes/emit-events';
import { EventEmitter, socketEmitter } from '@shared/index';
import { ChatView, FooterView, UserListComtroller, UserDialogueComtroller, HeaderView } from '@components/chat/index';

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
