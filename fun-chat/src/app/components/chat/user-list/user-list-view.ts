import './list.scss';
import { div } from '@utils/tag-create-functions';

export class UserListView {
  private list: HTMLDivElement = div({ className: 'list' });

  public getRoot(): HTMLDivElement {
    return this.list;
  }
}
