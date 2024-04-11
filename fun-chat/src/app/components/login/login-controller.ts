import { EventEmitter } from '@shared/event-emitter';
import { LoginInputNames } from '@alltypes/common';
import { AppEvents, LoginEvents } from '@alltypes/emit-events';
import { RemoteServer } from '@shared/web-socket';
import { LoginModel } from './login-model';
import { LoginView } from './login-view';

export class LoginController extends EventEmitter<LoginEvents> {
  private webSocket: RemoteServer;

  private loginModel: LoginModel;

  private emitter: EventEmitter<AppEvents>;

  private loginView: LoginView = new LoginView(this);

  private subs: (() => void)[] = [];

  constructor(webSocket: RemoteServer, emitter: EventEmitter<AppEvents>) {
    super();
    this.emitter = emitter;
    this.webSocket = webSocket;
    this.loginModel = new LoginModel(this.webSocket);
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
      this.emitter.subscribe('app-auth-error', (data: { error: string }) => this.loginView.showModal(data.error))
    );
    this.subs.push(
      this.emitter.subscribe('app-auth-success', () => {
        this.loginModel.addUser();
        this.removeLogin();
      })
    );
  }

  public changeInputValue(input: LoginInputNames, value: string): void {
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

  private removeLogin(): void {
    this.subs.forEach((unsubscribe: () => void) => unsubscribe());

    this.loginView.removeLoginView();
  }
}
