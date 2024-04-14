import { AppEvents, ChatEvents, UserListEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { User } from '@alltypes/serverResponse';
import { socketEmitter } from '@shared/const';
import { UserListView } from './user-list-view';
import { UserListModel } from './user-list-model';
import { getUsers } from '../../../web-socket.ts/socket-actions';

export class UserListComtroller extends EventEmitter<UserListEvents> {
  private view: UserListView;

  private model: UserListModel;

  private subs: (() => void)[] = [];

  constructor(
    private emitter: EventEmitter<AppEvents>,
    userName: string,
    private chatEmitter: EventEmitter<ChatEvents>
  ) {
    super();
    this.view = new UserListView(this);
    this.model = new UserListModel(userName);
    this.setSubscribers();
  }

  private setSubscribers(): void {
    this.subs.push(
      this.emitter.subscribe('users-get-active', (users: { data: User[] }) => {
        this.model.getUsers(users.data, this.view.setUserList.bind(this.view), 'active');
      })
    );
    this.subs.push(
      this.emitter.subscribe('users-get-inactive', (users: { data: User[] }) => {
        this.model.getUsers(users.data, this.view.setUserList.bind(this.view), 'inactive');
      })
    );
    this.subs.push(socketEmitter.subscribe('user-login', () => getUsers()));
    this.subs.push(socketEmitter.subscribe('user-logout', () => getUsers()));
    this.subs.push(
      this.subscribe('list-input', ({ value }) => this.model.search(value, this.view.setUserList.bind(this.view)))
    );
    this.subs.push(
      this.subscribe('list-user-active', ({ user }) => this.chatEmitter.emit('chat-conversation', { user }))
    );
  }

  public getUserListView(): HTMLDivElement {
    return this.view.getRoot();
  }

  public removeUserList(): void {
    this.subs.forEach((unsubscribe: () => void) => unsubscribe());
  }
}
