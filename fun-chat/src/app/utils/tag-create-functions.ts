import { BaseTagsProps, InputProps } from '@alltypes/tags';
import { createElement } from '@utils/dom-helpers';

function div(props: BaseTagsProps): HTMLDivElement {
  return createElement<BaseTagsProps, HTMLDivElement>('div', props);
}
function main(props: BaseTagsProps): HTMLDivElement {
  return createElement<BaseTagsProps, HTMLDivElement>('main', props);
}
function button(props: BaseTagsProps): HTMLButtonElement {
  return createElement<BaseTagsProps, HTMLButtonElement>('button', props);
}
function input(props: InputProps): HTMLInputElement {
  return createElement<InputProps, HTMLInputElement>('input', props);
}
function table(props: BaseTagsProps): HTMLTableElement {
  return createElement<BaseTagsProps, HTMLTableElement>('table', props);
}
function tr(props: BaseTagsProps): HTMLTableRowElement {
  return createElement<BaseTagsProps, HTMLTableRowElement>('tr', props);
}
function td(props: BaseTagsProps): HTMLTableCellElement {
  return createElement<BaseTagsProps, HTMLTableCellElement>('td', props);
}
function form(props: BaseTagsProps): HTMLFormElement {
  return createElement<BaseTagsProps, HTMLFormElement>('form', props);
}
function span(props: BaseTagsProps): HTMLSpanElement {
  return createElement<BaseTagsProps, HTMLSpanElement>('span', props);
}

export { div, main, button, input, table, tr, td, form, span };
