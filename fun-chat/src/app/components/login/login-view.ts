import './login.scss';
import { input, form, div, button, span } from '@utils/tag-create-functions';
import { type EventEmitter } from '@shared/event-emitter';
import { LoginInputNames } from '@alltypes/common';
import { LoginEvents } from '@alltypes/emit-events';
import { socketEmitter } from '@shared/const';
import { appendChildren } from '@utils/dom-helpers';

export class LoginView {
  private emitter: EventEmitter<LoginEvents>;

  private form: HTMLFormElement = form({ className: 'login' });

  private formCover: HTMLDivElement = div({ className: 'container' }, this.form);

  private nameInput: HTMLInputElement = input({
    className: 'login__input',
    type: 'text',
    placeholder: 'Name',
    required: 'true',
  });

  private passwordInput: HTMLInputElement = input({
    className: 'login__input',
    type: 'password',
    placeholder: 'Password',
    required: 'true',
  });

  private loginBtn: HTMLButtonElement = button({ className: 'login__btn btn', textContent: 'Log in' });

  private infoBtn: HTMLButtonElement = button({ className: 'btn', textContent: 'Info' });

  constructor(emitter: EventEmitter<LoginEvents>) {
    this.emitter = emitter;
    this.createFieldCover(this.nameInput, 'name');
    this.createFieldCover(this.passwordInput, 'password');
    appendChildren(this.form, [this.loginBtn, this.infoBtn]);
    this.setBtnState(true);
    this.form.addEventListener('submit', (event: Event) => this.emitter.emit('login-auth', { event }));
    this.infoBtn.addEventListener('click', () => socketEmitter.emit('click-info', { direction: 'to' }));
  }

  private createFieldCover(field: HTMLInputElement, name: LoginInputNames): void {
    const error = span({ className: 'login__error' });
    const cover = div({ className: 'login__field' }, field, error);
    this.form.append(cover);
    field.addEventListener('keyup', () => this.emitter.emit('login-input', { value: field.value, name }));
  }

  public setInputState(param: LoginInputNames, isError: boolean, textError?: string): void {
    let errorSpan: HTMLSpanElement;
    if (param === 'name') {
      errorSpan = this.nameInput.nextSibling as HTMLSpanElement;
    } else {
      errorSpan = this.passwordInput.nextSibling as HTMLSpanElement;
    }

    if (isError && textError) {
      errorSpan.textContent = textError;
    } else {
      errorSpan.textContent = '';
    }
  }

  public setBtnState(value: boolean): void {
    this.loginBtn.disabled = value;
  }

  public showModal(str: string): void {
    const closeBtn = button({ className: 'btn', textContent: 'ok' });
    const modal = div({ className: 'login__modal', textContent: str }, closeBtn);
    const overlay = div({ className: 'login__overlay' }, modal);
    document.body.append(overlay);

    const timeToApearModal = 10;
    const timeToDisappearModal = 300;

    setTimeout(() => modal.classList.add('login__modal-active'), timeToApearModal);

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('login__modal-active');
      setTimeout(() => {
        modal.remove();
        overlay.remove();
      }, timeToDisappearModal);
    });
  }

  public getRoot(): HTMLDivElement {
    return this.formCover;
  }

  public removeLoginView(): void {
    this.formCover.remove();
  }
}
