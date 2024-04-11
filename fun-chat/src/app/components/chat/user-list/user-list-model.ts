import { User } from '@alltypes/serverResponse';

export class UserListModel {
  private usersData: User[] = [];

  public getUsers(users: User[], currentUser: string, callback: (users: User[]) => void) {
    users.forEach((user, index) => {
      if (user.login === currentUser) {
        users.splice(index, 1);
      }
    });
    this.usersData = [...this.usersData, ...users];
    callback(this.usersData);
  }

  public search(value: string, callback: (users: User[]) => void) {
    const result: User[] = [];
    this.usersData.forEach((user) => {
      if (user.login.toLowerCase().includes(value.toLowerCase())) {
        result.push(user);
      }
    });
    callback(result);
  }
}
