export enum EventTypes {
  RoomBooked,
  RoomCanceled,
  RoomAdded
}

export interface Event {
  readonly eventType: EventTypes;
}

const _subscriptions: any = {};

interface Subscription<T extends Event> {
  readonly EventType: { new(param: any): T; }
  readonly callback: (evt: T) => void
}

export class Subscriber<T extends Event> {
  subscribe({EventType, callback}: Subscription<T>): void {
    const eventType = new EventType({}).eventType;
    if (!(eventType in _subscriptions)) {
      _subscriptions[eventType] = []
    }
    _subscriptions[eventType].push(callback)
  }
}

interface Publication<T extends Event> {
  readonly evt: T
}

export class Publisher<T extends Event> {
  publish({evt}: Publication<T>): void {
    (_subscriptions[evt.eventType] || []).forEach((value: ((evt: T) => void)) => value(evt))
  }
}