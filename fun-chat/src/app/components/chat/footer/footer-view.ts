import './footer.scss';
import { gitUrl, rssUrl } from '@shared/index';
import { a, div, image, section } from '@utils/index';
import rssLogo from '@assets/rs_school.svg';

export class FooterView {
  private footer: HTMLElement;

  constructor() {
    const img = image({ src: rssLogo, alt: 'RSSchool' });
    const year = div({ className: 'footer__item', textContent: '2024' });
    const rss = a({ href: rssUrl, className: 'footer__item' }, img);
    const student = a({ href: gitUrl, className: 'footer__item', textContent: 'rredq' });

    this.footer = section({ className: 'footer' }, rss, student, year);
  }

  public getRoot(): HTMLElement {
    return this.footer;
  }
}
