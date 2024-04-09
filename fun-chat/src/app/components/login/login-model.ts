import { LoginInputNames } from '@alltypes/common';
import { AuthResponseError, AuthResponseSucces } from '@alltypes/serverResponse';
import { RemoteServer } from '@shared/web-socket';

export class LoginModel {
  private name = '';

  private password = '';

  private nameGenrealRegexp: RegExp = /^(?=.{3,60}$)[A-Z][\\-a-zA-z]+$/;

  private passwordGeneralRegExp: RegExp = /^(?=.{4,60}$)[A-Z][\\-a-zA-z]+$/;

  private englishTextRegEx: RegExp = /^[a-zA-Z\s-]*$/;

  private firstletterRegEx: RegExp = /^[А-ЯA-Z][а-яА-Яa-zA-Z\s-]*$/;

  private webSocket: RemoteServer;

  constructor(webSocket: RemoteServer) {
    this.webSocket = webSocket;
  }

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
      message = 'The name must consist of at least 3 letters';
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

  public async setAuth(success: (login: string) => void, fail: (str: string) => void) {
    const userId = '1';
    const result: AuthResponseSucces | AuthResponseError = await this.webSocket.setAuth(
      userId,
      this.name,
      this.password
    );

    if (result.type === 'USER_LOGIN') {
      success(result.payload.user.login);
    } else {
      fail(result.payload.error);
    }
  }
}
