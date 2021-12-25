interface Booking {
  clientId: string;
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
}

export class CommandService {
  bookARoom(booking: Booking): void {
    EventNotifications.publish({
      roomName: booking.roomName,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate
    })
  }
}

interface RoomBookedEvent {
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
}


class EventNotifications {
  private static _subscriptions: (({roomBookedEvent}: { roomBookedEvent: RoomBookedEvent }) => void)[] = []

  static subscribe(callback: ({roomBookedEvent}: { roomBookedEvent: RoomBookedEvent }) => void): void {
    EventNotifications._subscriptions.push(callback)
  }

  static publish(roomBookedEvent: RoomBookedEvent): void {
    this._subscriptions.forEach(value => value({roomBookedEvent}))
  }
}

interface Room {
  roomName: string;
}

export class QueryService {
  private static _rooms = new Array(10).fill(1)
    .map((_, index): Room => {
      return {
        roomName: index + ""
      }
    })

  constructor() {
    EventNotifications.subscribe(({roomBookedEvent}) => {
      QueryService._rooms = QueryService._rooms
        .filter(value => value.roomName !== roomBookedEvent.roomName)
    })
  }

  freeRooms(arrival: Date, departure: Date): Room[] {
    return QueryService._rooms;
  }
}