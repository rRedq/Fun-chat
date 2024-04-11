import { BaseTagsProps, InputProps } from '@alltypes/tags';
import { createElement } from '@utils/dom-helpers';

function div(props: BaseTagsProps, ...children: HTMLElement[]): HTMLDivElement {
  return createElement<BaseTagsProps, HTMLDivElement>('div', props, children);
}
function main(props: BaseTagsProps, ...children: HTMLElement[]): HTMLDivElement {
  return createElement<BaseTagsProps, HTMLDivElement>('main', props, children);
}
function section(props: BaseTagsProps, ...children: HTMLElement[]): HTMLElement {
  return createElement<BaseTagsProps, HTMLElement>('section', props, children);
}
function button(props: BaseTagsProps): HTMLButtonElement {
  return createElement<BaseTagsProps, HTMLButtonElement>('button', props);
}
function input(props: InputProps): HTMLInputElement {
  return createElement<InputProps, HTMLInputElement>('input', props);
}
function table(props: BaseTagsProps, ...children: HTMLElement[]): HTMLTableElement {
  return createElement<BaseTagsProps, HTMLTableElement>('table', props, children);
}
function tr(props: BaseTagsProps, ...children: HTMLElement[]): HTMLTableRowElement {
  return createElement<BaseTagsProps, HTMLTableRowElement>('tr', props, children);
}
function td(props: BaseTagsProps): HTMLTableCellElement {
  return createElement<BaseTagsProps, HTMLTableCellElement>('td', props);
}
function form(props: BaseTagsProps, ...children: HTMLElement[]): HTMLFormElement {
  return createElement<BaseTagsProps, HTMLFormElement>('form', props, children);
}
function span(props: BaseTagsProps): HTMLSpanElement {
  return createElement<BaseTagsProps, HTMLSpanElement>('span', props);
}
function a(props: BaseTagsProps & { href: string }, ...children: HTMLElement[]): HTMLAnchorElement {
  return createElement<BaseTagsProps, HTMLAnchorElement>('a', props, children);
}
function image(props: BaseTagsProps & { src: string; alt: string }): HTMLImageElement {
  return createElement<BaseTagsProps, HTMLImageElement>('img', props);
}

export { div, main, button, input, table, tr, td, form, span, section, a, image };
