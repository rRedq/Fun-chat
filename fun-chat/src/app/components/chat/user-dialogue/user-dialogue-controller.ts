import { UserDialogueView } from './user-dialogue-view';

export class UserDialogueComtroller {
  private list: UserDialogueView = new UserDialogueView();

  public getUserListView(): HTMLDivElement {
    return this.list.getRoot();
  }
}
