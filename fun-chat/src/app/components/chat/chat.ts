import './chat.scss';
import { AppEvents } from '@alltypes/emit-events';
import { EventEmitter } from '@shared/event-emitter';
import { RemoteServer } from '@shared/web-socket';
import { main } from '@utils/tag-create-functions';
import { HeaderView } from './header/header-view';

export class Chat {
  private chat: HTMLDivElement;

  private webSocket: RemoteServer;

  constructor(webSocket: RemoteServer, emitter: EventEmitter<AppEvents>, userName: string) {
    this.webSocket = webSocket;
    this.chat = main({ className: 'chat' });
    this.init(emitter, userName);
  }

  private init(emitter: EventEmitter<AppEvents>, userName: string) {
    const header = new HeaderView(emitter, userName, this.removeChat.bind(this)).returnHeaderView();
    this.chat.append(header);
  }

  private removeChat(): void {
    this.chat.remove();
  }

  public returnChatRoot(): HTMLDivElement {
    return this.chat;
  }
}
