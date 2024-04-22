import './error.scss';
import { div } from '@utils/tag-create-functions';

export class ErrorPage {
  private root: HTMLDivElement = div(
    { className: 'error' },
    div({ className: 'error__header', textContent: `The page you requested doesn't exist` }),
    div({
      className: 'error__content',
      textContent: `The correct page name must begin with the “#” symbol and must contain one of the keywords “login”, “info”, “chat”.`,
    })
  );

  public getErrorPage(): HTMLDivElement {
    return this.root;
  }

  public remove(): void {
    this.root.remove();
  }
}
