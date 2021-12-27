export interface Event {
}

type CallbackFunction = (evt: any) => void;

const _subscriptions: Map<string, CallbackFunction[]> = new Map<string, CallbackFunction[]>();

interface Subscription<T extends Event> {
  readonly EventType: { new(param: any): T; }
  readonly callback: CallbackFunction
}

export class Subscriber<T extends Event> {
  subscribe({EventType, callback}: Subscription<T>): void {
    const eventType = new EventType({}).constructor.name;
    const subscriptionsForEventType = _subscriptions.get(eventType);
    if (subscriptionsForEventType) {
      subscriptionsForEventType.push(callback);
    } else {
      _subscriptions.set(eventType, [callback]);
    }
  }
}

interface Publication<T extends Event> {
  readonly evt: T
}

export class Publisher<T extends Event> {
  publish({evt}: Publication<T>): void {
    (_subscriptions.get(evt.constructor.name) || []).forEach((value: ((evt: T) => void)) => value(evt))
  }
}