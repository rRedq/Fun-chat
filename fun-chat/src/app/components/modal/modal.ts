import './modal.scss';
import { div } from '@utils/tag-create-functions';

export class Modal {
  private modal = div(
    {
      className: 'modal',
    },
    div({ className: 'spinner' }),
    div({ textContent: 'trying to reconnect...' })
  );

  private overlay = div({ className: 'overlay' });

  public createReconnectModal(): void {
    this.overlay.append(this.modal);
    document.body.append(this.overlay);

    const timeToApearModal = 10;

    setTimeout(() => this.modal.classList.add('modal-active'), timeToApearModal);
  }

  public closeModal() {
    const timeToDisappearModal = 300;
    this.modal.classList.remove('modal-active');
    setTimeout(() => {
      this.modal.remove();
      this.overlay.remove();
    }, timeToDisappearModal);
  }
}
