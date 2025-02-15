import { EnumResponses } from '@alltypes/enum';
import { Message, User } from '@alltypes/socketTypes';
import { getMessageHistoryWithUser, getUsers } from '@socket/index';

export class UserListModel {
  private activeUsers: User[] = [];

  private inactiveUsers: User[] = [];

  private unreadMessages = new Map<string, number>();

  constructor(private userName: string) {
    getUsers();
  }

  public countUnreadMessages(
    messages: Message[],
    callback: (users: User[], counters?: Map<string, number>) => void
  ): void {
    let count = 0;
    let author = '';
    messages.forEach((message) => {
      if (message.to === this.userName && !message.status.isReaded) {
        author = message.from;
        count += 1;
      }
    });
    if (author) {
      this.unreadMessages.set(author, count);
      callback([...this.activeUsers, ...this.inactiveUsers], this.unreadMessages);
    }
  }

  public getUsers(users: User[], callback: (users: User[]) => void, type: 'active' | 'inactive'): void {
    [...users].forEach((user, index) => {
      if (user.login === this.userName) {
        users.splice(index, 1);
      } else {
        getMessageHistoryWithUser(user.login, EnumResponses.count);
      }
    });

    if (type === 'active') {
      this.activeUsers = users;
    } else {
      this.inactiveUsers = users;
    }
    callback([...this.activeUsers, ...this.inactiveUsers]);
  }

  public search(value: string, callback: (users: User[], counters?: Map<string, number>) => void) {
    const result: User[] = [];
    [...this.activeUsers, ...this.inactiveUsers].forEach((user) => {
      if (user.login.toLowerCase().includes(value.toLowerCase())) {
        result.push(user);
      }
    });
    callback(result, this.unreadMessages);
  }
}
