import { LoginInputNames, UserData } from '@alltypes/common';
import { ResponseError, AuthResponse } from '@alltypes/serverResponse';
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

  public async setAuth(success: (data: UserData) => void, fail: (str: string) => void) {
    try {
      const id = crypto.randomUUID();
      // const id = 'login';
      const result: AuthResponse | ResponseError = await this.webSocket.setAuth({
        id,
        name: this.name,
        password: this.password,
      });

      if (result.type === 'USER_LOGIN') {
        // заменить
        sessionStorage.setItem('auth', JSON.stringify({ id, name: this.name, password: this.password }));
        //
        success({ id, name: result.payload.user.login, password: this.password });
      } else if (result.type === 'ERROR') {
        fail(result.payload.error);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
