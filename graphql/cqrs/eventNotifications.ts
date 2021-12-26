export class RoomBookedEvent implements Event {
  private readonly _roomName: string;
  private readonly _arrivalDate: Date;
  private readonly _departureDate: Date;

  constructor({
                roomName,
                arrivalDate,
                departureDate
              }: { roomName: string, arrivalDate: Date, departureDate: Date }) {
    this._roomName = roomName;
    this._arrivalDate = arrivalDate;
    this._departureDate = departureDate;
  }

  get departureDate(): Date {
    return this._departureDate;
  }

  get arrivalDate(): Date {
    return this._arrivalDate;
  }

  get roomName(): string {
    return this._roomName;
  }

  get eventType(): EventTypes {
    return EventTypes.RoomBooked;
  }
}

export class RoomCanceledEvent implements Event {
  private readonly _roomName: string;
  private readonly _date: Date;

  constructor({roomName, date}: { roomName: string, date: Date }) {
    this._roomName = roomName;
    this._date = date;
  }

  get date(): Date {
    return this._date;
  }

  get roomName(): string {
    return this._roomName;
  }

  get eventType(): EventTypes {
    return EventTypes.RoomCanceled;
  }
}

enum EventTypes {
  RoomBooked,
  RoomCanceled
}

interface Event {
  readonly eventType: EventTypes
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

export class Publisher<T extends Event> {
  publish(evt: T): void {
    (_subscriptions[evt.eventType] || []).forEach((value: ((evt: T) => void)) => value(evt))
  }
}