import { EventEmitter, socketEmitter } from '@shared/index';
import { LoginInputNames } from '@alltypes/common';
import { LoginEvents } from '@alltypes/emit-events';
import { LoginModel } from './login-model';
import { LoginView } from './login-view';

export class LoginController extends EventEmitter<LoginEvents> {
  private loginModel: LoginModel;

  private loginView: LoginView = new LoginView(this);

  private subs: (() => void)[] = [];

  constructor() {
    super();
    this.loginModel = new LoginModel();
    this.setSubscribers();
  }

  private setSubscribers(): void {
    this.subs.push(
      this.subscribe('login-input', (data: { value: string; name: LoginInputNames }) => {
        this.changeInputValue(data.name, data.value);
      })
    );
    this.subs.push(this.subscribe('login-auth', (data: { event: Event }) => this.submitForm(data.event)));

    this.subs.push(
      socketEmitter.subscribe('app-auth-error', (data: { error: string }) => this.loginView.showModal(data.error))
    );
    const login = socketEmitter.subscribe('app-auth-success', () => {
      this.loginModel.addUser();
      this.removeLogin();
      login();
    });
  }

  private changeInputValue(input: LoginInputNames, value: string): void {
    const text = this.loginModel.checkInputValue(input, value);
    if (text) {
      this.loginView.setInputState(input, true, text);
    } else {
      this.loginView.setInputState(input, false, text);
    }

    const checkAllFieldsValue = this.loginModel.checkAllFields();
    if (checkAllFieldsValue) {
      this.loginView.setBtnState(false);
    } else {
      this.loginView.setBtnState(true);
    }
  }

  public submitForm(e: Event): void {
    e.preventDefault();
    this.loginModel.setAuthentication();
  }

  public getLoginViewRoot(): HTMLDivElement {
    return this.loginView.getRoot();
  }

  public removeLogin(): void {
    this.subs.forEach((unsubscribe: () => void) => unsubscribe());

    this.loginView.removeLoginView();
  }
}
