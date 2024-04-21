import { isNull } from '@utils/functions';

type Listener<T> = (data: T) => void;

export class EventEmitter<T> {
  private events = new Map<keyof T, Listener<T[keyof T]>[]>();

  public subscribe<K extends keyof T>(eventName: K, handler: Listener<T[K]>): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const listeners: Listener<T[K]>[] = isNull(this.events.get(eventName));
    listeners.push(handler);

    return () => listeners.splice(listeners.indexOf(handler), 1);
  }

  public emit<K extends keyof T>(eventName: K, data: T[K]): void {
    if (this.events.has(eventName)) {
      const events: Listener<T[keyof T]>[] = [...isNull(this.events.get(eventName)).reverse()];
      events.forEach((handler) => handler(data));
    }
  }
}
