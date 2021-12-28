export interface Event {
}

type CallbackFunction = (evt: any) => void;

const _subscriptions: Map<string, CallbackFunction[]> = new Map<string, CallbackFunction[]>();

type EventCallback<T extends Event> = (evt: T) => void;

type FunctionAcceptingCallback<T extends Event> = {
  (eventCallback: EventCallback<T>): void
}

export class Subscriber<T extends Event> {
  subscribe(EventType: { new(param: any): T; }): FunctionAcceptingCallback<T> {
    const eventType = new EventType({}).constructor.name;
    return (callback: (evt: T) => void): void => {
      const subscriptionsForEventType = _subscriptions.get(eventType);
      if (subscriptionsForEventType) {
        subscriptionsForEventType.push(callback);
      } else {
        _subscriptions.set(eventType, [callback]);
      }
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