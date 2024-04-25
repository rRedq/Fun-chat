import { Message, User } from '@alltypes/socketTypes';
import { changeMsgToReadStatus, getMessageHistoryWithUser, sendMessage } from '@socket/index';

export class UserDialogueModel {
  private interlocutor = '';

  private changeToRead = false;

  constructor(private userName: string) {}

  public getCurrentConversation(messages: Message[], callback: (dialogue: Message[]) => void): void {
    if (!this.changeToRead) {
      callback(messages);
    } else {
      messages.forEach((message) => {
        if (message.from === this.interlocutor && message.to === this.userName && !message.status.isReaded) {
          changeMsgToReadStatus(message.id);
        }
      });
    }
    this.changeToRead = false;
  }

  public isCurrentConversation(message: Message, callback: (message: Message) => void): void {
    if (message.from === this.interlocutor) {
      callback(message);
    }
  }

  public isInterlocutor(user: User, callback: (status: boolean) => void): void {
    if (user.login === this.interlocutor) {
      callback(user.isLogined);
    }
  }

  public sendMessage(text: string) {
    sendMessage(this.interlocutor, text);
  }

  public changeReadStatus(status: boolean): void {
    getMessageHistoryWithUser(this.interlocutor, 'MSG_HISTORY');
    this.changeToRead = status;
  }

  public setInterlocutor(interlocutor: string): void {
    this.interlocutor = interlocutor;
    getMessageHistoryWithUser(this.interlocutor, 'MSG_HISTORY');
  }
}
