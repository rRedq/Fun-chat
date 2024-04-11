import './dialugue.scss';
import { div } from '@utils/tag-create-functions';

export class UserDialogueView {
  private root: HTMLDivElement = div({ className: 'dialogue' });

  public getRoot(): HTMLDivElement {
    return this.root;
  }
}
