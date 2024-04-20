import { User } from '@alltypes/serverResponse';
import './list.scss';
import { div, input } from '@utils/tag-create-functions';
import { UserListEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';

export class UserListView {
  private usersList: HTMLDivElement = div({ className: 'list__users' });

  private search: HTMLInputElement = input({ className: 'list__search', placeholder: 'Search...' });

  private list: HTMLDivElement = div({ className: 'list' }, this.search, this.usersList);

  constructor(private emitter: EventEmitter<UserListEvents>) {
    this.search.addEventListener('keyup', () => this.emitter.emit('list-input', { value: this.search.value }));
  }

  public setUserList(users: User[], counters?: Map<string, number>): void {
    this.usersList.replaceChildren();
    if (counters) {
      users.forEach((user) => this.usersList.append(this.setUser(user, counters.get(user.login))));
    } else {
      users.forEach((user) => this.usersList.append(this.setUser(user)));
    }
  }

  private setUser(user: User, count?: number): HTMLDivElement {
    const isCount = count || '';
    const status = div({ className: user.isLogined ? 'list__status-online' : 'list__status-offline' });
    const label = div({ className: 'list__name', textContent: `${user.login}` });
    const item = div({ className: 'list__item' }, status, label);
    if (isCount) {
      const unreadCount = div({ className: 'list__count', textContent: `${isCount}` });
      item.append(unreadCount);
    }
    item.addEventListener('click', () => this.emitter.emit('list-user-active', { user }));
    return item;
  }

  public getRoot(): HTMLDivElement {
    return this.list;
  }
}
