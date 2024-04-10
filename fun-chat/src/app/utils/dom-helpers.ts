function appendChildren(parent: HTMLElement, children: HTMLElement[]): void {
  children.forEach((child) => parent.append(child));
}

function createElement<U, T extends HTMLElement = HTMLElement, K extends HTMLElement = HTMLElement>(
  tag: keyof HTMLElementTagNameMap,
  props: U,
  children?: K[]
): T {
  const elem: T = document.createElement(tag) as T;
  Object.assign(elem, props);
  if (children) {
    appendChildren(elem, children);
  }
  return elem;
}

export { createElement, appendChildren };
