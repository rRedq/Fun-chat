import { EventEmitter } from '@shared/event-emitter';
import { LoginInputNames, UserData } from '@alltypes/common';
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
    this.subs.push(
      this.subscribe('login-input', (data: { value: string; name: LoginInputNames }) =>
        this.changeInputValue(data.name, data.value)
      )
    );
    this.subs.push(this.subscribe('login-auth', (data: { event: Event }) => this.submitForm(data.event)));
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
    this.loginModel.setAuth(this.removeLogin.bind(this), this.loginView.showModal);
  }

  public getLoginViewRoot(): HTMLFormElement {
    return this.loginView.getRoot();
  }

  private removeLogin({ id, name, password }: UserData): void {
    this.emitter.emit('app-auth', { id, name, password });
    this.subs.forEach((unsubscribe: () => void) => unsubscribe());
    this.subs.length = 0;
    this.loginView.removeLoginView();
  }
}
