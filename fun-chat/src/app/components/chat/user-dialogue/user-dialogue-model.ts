import { Message, User } from '@alltypes/serverResponse';
import { isNull } from '@utils/functions';

export class UserDialogueModel {
  private conversation: Message[] = [];

  private companion: User | undefined;

  public getDialogueWithUser(callback: (user: User, dialogue?: Message[]) => void, message?: Message): void {
    if (message) this.conversation.push(message);
    if (this.companion) {
      const dialogue: Message[] = this.conversation.filter(
        (companion) => companion.to === isNull(this.companion).login
      );
      callback(this.companion, dialogue);
    }
  }

  setUser(user: User): void {
    this.companion = user;
  }
}
