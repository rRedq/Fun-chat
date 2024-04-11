import { UserListView } from './user-list-view';

export class UserListComtroller {
  private list: UserListView = new UserListView();

  public getUserListView(): HTMLDivElement {
    return this.list.getRoot();
  }
}
