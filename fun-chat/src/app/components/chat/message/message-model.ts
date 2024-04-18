import { CoreEditMsg, Message } from '@alltypes/serverResponse';

export class MessageModel {
  constructor(private message: Message) {}

  public getMessage(): Message {
    return this.message;
  }

  public isRead(id: string): boolean {
    return this.message.id === id;
  }

  public changeMessage(): { id: string; text: string } {
    return { id: this.message.id, text: this.message.text };
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
