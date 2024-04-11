import { AppEvents, UserListEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { User } from '@alltypes/serverResponse';
import { UserListView } from './user-list-view';
import { UserListModel } from './user-list-model';

export class UserListComtroller extends EventEmitter<UserListEvents> {
  private view: UserListView = new UserListView(this);

  private model: UserListModel = new UserListModel();

  private subs: (() => void)[] = [];

  constructor(
    private emitter: EventEmitter<AppEvents>,
    private userName: string
  ) {
    super();
    this.setSubscribers();
  }

  private setSubscribers(): void {
    this.subs.push(
      this.emitter.subscribe('app-get-users', (users: { data: User[] }) => {
        this.model.getUsers(users.data, this.userName, this.view.setUserList.bind(this.view));
      })
    );
    this.subs.push(
      this.subscribe('list-input', ({ value }) => this.model.search(value, this.view.setUserList.bind(this.view)))
    );
  }

  public getUserListView(): HTMLDivElement {
    return this.view.getRoot();
  }

  public removeUserList(): void {
    this.subs.forEach((unsubscribe: () => void) => unsubscribe());
  }
}
