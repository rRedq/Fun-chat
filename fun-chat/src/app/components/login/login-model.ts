import { LoginInputNames, UserData } from '@alltypes/common';
import { getStorage, setStorage } from '@utils/index';
import { sendAuthentication } from '@socket/index';

export class LoginModel {
  private name = '';

  private password = '';

  private nameGenrealRegexp: RegExp = /^(?=.{3,10}$)[A-Z][\\-a-zA-z]+$/;

  private passwordGeneralRegExp: RegExp = /^(?=.{4,60}$)[A-Z][\\-a-zA-z]+$/;

  private englishTextRegEx: RegExp = /^[a-zA-Z\s-]*$/;

  private firstletterRegEx: RegExp = /^[А-ЯA-Z][а-яА-Яa-zA-Z\s-]*$/;

  public checkInputValue(param: LoginInputNames, value: string): string {
    if (param === 'name') {
      this.name = value;
    } else {
      this.password = value;
    }
    let message: string;
    if (!this.firstletterRegEx.test(value)) {
      message = 'First letter must be in uppercase';
    } else if (!this.englishTextRegEx.test(value)) {
      message = 'The text must be in English';
    } else if (param === 'name' && !this.nameGenrealRegexp.test(value)) {
      message = 'The name must consist of at least 3 but no more than 10 letters';
    } else if (param === 'password' && !this.passwordGeneralRegExp.test(value)) {
      message = 'The password must consist of at least 4 letters';
    } else {
      message = '';
    }

    return message;
  }

  public checkAllFields(): boolean {
    if (this.passwordGeneralRegExp.test(this.password) && this.nameGenrealRegexp.test(this.name)) {
      return true;
    }
    return false;
  }

  public setAuthentication(): void {
    sendAuthentication({ name: this.name, password: this.password }, 'USER_LOGIN');
  }

  public addUser(): void {
    const user: UserData | null = getStorage();
    if (!user) {
      setStorage({ name: this.name, password: this.password });
    }
  }
}
