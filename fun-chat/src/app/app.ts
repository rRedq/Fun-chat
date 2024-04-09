import { LoginController } from '@components/login/login-controller';
import { div } from '@utils/tag-create-functions';
import { RemoteServer } from '@shared/web-socket';
import { EventEmitter } from '@shared/event-emitter';
import { AppEvents } from '@alltypes/emit-events';

export class App extends EventEmitter<AppEvents> {
  private app: HTMLDivElement;

  private webSocket = new RemoteServer();

  constructor() {
    super();
    this.app = div({ className: 'app' });
    document.body.append(this.app);
    this.subscribe('app-auth', (data: { login: string }) => this.createChatPage(data.login));
  }

  public createLoginPage(): void {
    const login = new LoginController(this.webSocket, this);
    this.app.append(login.getLoginViewRoot());
  }

  public createChatPage(login: string): void {
    console.log(login);
  }
}
