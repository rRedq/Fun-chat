import './login.scss';
import { appendChildren } from '@utils/dom-helpers';
import { input, form, div, button, span } from '@utils/tag-create-functions';
import { type EventEmitter } from '@shared/event-emitter';
import { LoginInputNames } from '@alltypes/common';
import { LoginEvents } from '@alltypes/emit-events';

export class LoginView {
  private emitter: EventEmitter<LoginEvents>;

  private form: HTMLFormElement = form({ className: 'login' });

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

  private btn: HTMLButtonElement = button({ className: 'login__btn btn', textContent: 'Log in' });

  constructor(emitter: EventEmitter<LoginEvents>) {
    this.emitter = emitter;
    this.createFieldCover(this.nameInput, 'name');
    this.createFieldCover(this.passwordInput, 'password');
    this.form.append(this.btn);
    this.setBtnState(true);
    this.form.addEventListener('submit', (event: Event) => this.emitter.emit('login-auth', { event }));
  }

  private createFieldCover(field: HTMLInputElement, name: LoginInputNames): void {
    const cover = div({ className: 'login__field' });
    const error = span({ className: 'login__error' });
    appendChildren(cover, [field, error]);
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
    this.btn.disabled = value;
  }

  public showModal(str: string): void {
    const overlay = div({ className: 'login__overlay' });
    const modal = div({ className: 'login__modal', textContent: str });
    const closeBtn = button({ className: 'btn', textContent: 'ok' });
    overlay.append(modal);
    modal.append(closeBtn);
    document.body.append(overlay);

    const timeToApearModal = 10;
    const timeToDisappearModal = 300;

    setTimeout(() => {
      modal.classList.add('login__modal-active');
    }, timeToApearModal);

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('login__modal-active');
      setTimeout(() => {
        modal.remove();
        overlay.remove();
      }, timeToDisappearModal);
    });
  }

  public getRoot(): HTMLFormElement {
    return this.form;
  }

  public removeLoginView(): void {
    this.form.remove();
  }
}
