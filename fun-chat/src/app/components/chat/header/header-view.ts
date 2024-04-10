import './header.scss';
import { AppEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { button, div, section } from '@utils/tag-create-functions';

export class HeaderView {
  private header: HTMLElement;

  constructor(emitter: EventEmitter<AppEvents>, userName: string, removeChat: () => void) {
    const infoBtn = button({ className: 'btn', textContent: 'Info' });
    const closeBtn = button({ className: 'btn', textContent: 'Logout' });
    const user = div({ className: 'header__text', textContent: `User: ${userName}` });
    const label = div({ className: 'header__text', textContent: 'Fun chat' });
    const container = div({ className: 'header__container' }, user, label);
    this.header = section({ className: 'header' }, container, infoBtn, closeBtn);
    closeBtn.addEventListener('click', () => {
      emitter.emit('app-logout', { status: true });
      removeChat();
    });
    console.log(emitter);
  }

  public returnHeaderView(): HTMLElement {
    return this.header;
  }
}
