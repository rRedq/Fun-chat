import './info.scss';
import { gitUrl, socketEmitter } from '@shared/index';
import { a, button, div } from '@utils/index';

export class InfoPage {
  private backBtn: HTMLButtonElement = button({ className: 'btn', textContent: 'back' });

  private root: HTMLDivElement = div(
    { className: 'info' },
    div({ className: 'info__header', textContent: 'Fun-chat' }),
    div({
      className: 'info__text',
      textContent: 'The application was developed within the course  RSSchool JS/FE 2023Q3',
    }),
    div(
      {
        className: 'info__text',
      },
      a({ href: gitUrl, className: 'info__link', textContent: 'Developed by rredq' })
    ),
    this.backBtn
  );

  constructor() {
    this.backBtn.addEventListener('click', () => socketEmitter.emit('click-info', { direction: 'from' }));
  }

  public getRoot(): HTMLDivElement {
    return this.root;
  }

  public removeInfoPage(): void {
    this.root.remove();
  }
}
