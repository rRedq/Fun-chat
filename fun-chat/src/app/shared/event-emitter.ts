import { isNull } from '@utils/functions';

type Listener<T> = (data: T) => void;

export class EventEmitter<T> {
  private events = new Map<keyof T, Listener<T[keyof T]>[]>();

  subscribe<K extends keyof T>(eventName: K, handler: Listener<T[K]>): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const listeners: Listener<T[K]>[] = isNull(this.events.get(eventName));
    listeners.push(handler);

    return () => {
      listeners.filter((func) => handler !== func);
    };
  }

  emit<K extends keyof T>(eventName: K, data: T[K]): void {
    if (this.events.has(eventName)) {
      const events: Listener<T[keyof T]>[] = isNull(this.events.get(eventName));
      events.forEach((handler) => {
        handler(data);
      });
    }
  }
}
