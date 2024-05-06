import { timeToApearModal, timeToDisappearModal } from '@shared/const';
import './modal.scss';
import { div } from '@utils/index';

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

    setTimeout(() => this.modal.classList.add('modal-active'), timeToApearModal);
  }

  public closeModal() {
    this.modal.classList.remove('modal-active');
    setTimeout(() => {
      this.modal.remove();
      this.overlay.remove();
    }, timeToDisappearModal);
  }
}
