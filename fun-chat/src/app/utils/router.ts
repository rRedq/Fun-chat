export class Router {
  constructor(private callback: (str: string) => void) {
    window.addEventListener('hashchange', this.checkPath);
  }

  public setPath(path: 'chat' | 'info' | 'login'): void {
    window.location.replace(`${window.location.origin}${window.location.pathname}#${path}`);
  }

  public checkPath = (): void => {
    const indexAfter = 1;
    this.callback(window.location.href.slice(window.location.href.indexOf('#') + indexAfter));
  };
}
