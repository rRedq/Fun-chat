import './header.scss';
import { socketEmitter } from '@shared/index';
import { button, div, section } from '@utils/index';

export class HeaderView {
  private header: HTMLElement;

  constructor(userName: string) {
    const infoBtn = button({ className: 'btn', textContent: 'Info' });
    const closeBtn = button({ className: 'btn', textContent: 'Logout' });
    const user = div({ className: 'header__text', textContent: `User: ${userName}` });
    const label = div({ className: 'header__text', textContent: 'Fun chat' });
    const container = div({ className: 'header__container' }, user, label);
    this.header = section({ className: 'header' }, container, infoBtn, closeBtn);
    closeBtn.addEventListener('click', () => socketEmitter.emit('app-logout', { status: true }));
    infoBtn.addEventListener('click', () => socketEmitter.emit('click-info', { direction: 'to' }));
  }

  public getHeaderView(): HTMLElement {
    return this.header;
  }
}
