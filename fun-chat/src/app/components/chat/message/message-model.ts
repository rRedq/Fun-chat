import { CoreEditMsg, Message } from '@alltypes/socketTypes';
import { requestDeleteMsg } from '../../../web-socket.ts/socket-actions';

export class MessageModel {
  constructor(private message: Message) {}

  public getMessage(): Message {
    return this.message;
  }

  public isCurrentMessage(id: string): boolean {
    return this.message.id === id;
  }

  public getMessageStatus(): {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  } {
    return this.message.status;
  }

  public changeMessage(): { id: string; text: string } {
    return { id: this.message.id, text: this.message.text };
  }

  public deleteMessage(): void {
    requestDeleteMsg(this.message.id);
  }

  public updateMessage(data: CoreEditMsg, callback: (text: string, isEdited: boolean) => void) {
    const { id, text, status } = data;
    if (this.message.id === id) {
      this.message.text = text;
      this.message.status.isEdited = status.isEdited;
      callback(text, status.isEdited);
    }
  }
}
