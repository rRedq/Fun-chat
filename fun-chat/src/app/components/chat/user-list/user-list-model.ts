import { User } from '@alltypes/serverResponse';
import { getUsers } from '../../../web-socket.ts/socket-actions';

export class UserListModel {
  private usersData: User[] = [];

  private activeUsers: User[] = [];

  private inactiveUsers: User[] = [];

  constructor(private userName: string) {
    getUsers();
  }

  public getUsers(users: User[], callback: (users: User[]) => void, type: 'active' | 'inactive'): void {
    users.forEach((user, index) => {
      if (user.login === this.userName) {
        users.splice(index, 1);
      }
    });
    if (type === 'active') {
      this.activeUsers = users;
    } else {
      this.inactiveUsers = users;
    }
    callback([...this.activeUsers, ...this.inactiveUsers]);
  }

  public search(value: string, callback: (users: User[]) => void) {
    const result: User[] = [];
    [...this.activeUsers, ...this.inactiveUsers].forEach((user) => {
      if (user.login.toLowerCase().includes(value.toLowerCase())) {
        result.push(user);
      }
    });
    callback(result);
  }
}
