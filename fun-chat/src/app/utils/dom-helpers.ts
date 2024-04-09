function createElement<U, T extends HTMLElement = HTMLElement>(tag: keyof HTMLElementTagNameMap, props: U): T {
  const elem = document.createElement(tag);
  Object.assign(elem, props);
  return elem as T;
}

function appendChildren(parent: HTMLElement, arr: HTMLElement[]): void {
  arr.forEach((node) => parent.append(node));
}

export { createElement, appendChildren };
