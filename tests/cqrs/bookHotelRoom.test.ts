import {CommandService, QueryService} from "../../graphql/cqrs/bookHotelRoom";

describe('book hotel room', () => {
  it('should have free rooms', () => {
    expect(new QueryService()
      .freeRooms(new Date("2021-12-25"), new Date("2021-12-26")))
      .toHaveLength(10);
  });

  describe('should book a room', () => {
    const queryService = new QueryService();
    const rooms = queryService.freeRooms(new Date("2021-12-24"), new Date("2021-12-26"));
    const commandService = new CommandService();
    commandService.bookARoom({
      arrivalDate: new Date("2021-12-24"),
      clientId: "short stay",
      departureDate: new Date("2021-12-26"),
      roomName: rooms[0].roomName
    })
    commandService.bookARoom({
      arrivalDate: new Date("2021-01-01"),
      clientId: "long stay",
      departureDate: new Date("2021-12-31"),
      roomName: rooms[1].roomName
    })

    function isNotAvailableBetween(arrival: Date, departure: Date, roomName: string) {
      expect(queryService
        .freeRooms(arrival, departure)
        .map(x => x.roomName))
        .not.toContain(roomName);
    }

    function isAvailableBetween(arrival: Date, departure: Date, roomName: string) {
      expect(queryService
        .freeRooms(arrival, departure)
        .map(x => x.roomName))
        .toContain(roomName);
    }

    it('should not be available on last day of reservation', () => {
      isNotAvailableBetween(new Date("2021-12-25"), new Date("2021-12-26"), rooms[0].roomName);
    });
    it('should not be available on first day of reservation', () => {
      isNotAvailableBetween(new Date("2021-12-24"), new Date("2021-12-25"), rooms[0].roomName);
    });
    it('should not be available over entire reservation', () => {
      isNotAvailableBetween(new Date("2021-12-24"), new Date("2021-12-26"), rooms[0].roomName);
    });
    it('should not be available on span over entire duration', () => {
      isNotAvailableBetween(new Date("2021-12-01"), new Date("2021-12-31"), rooms[0].roomName);
    });
    it('should be available immediately after the reservation expires', () => {
      isAvailableBetween(new Date("2021-12-26"), new Date("2021-12-27"), rooms[0].roomName)
    });
    it('should be available immediately before the reservation starts', () => {
      isAvailableBetween(new Date("2021-12-21"), new Date("2021-12-24"), rooms[0].roomName)
    });
    describe('should not be available at any point during the long reservation', () => {
      it('middle', () => {
        isNotAvailableBetween(new Date("2021-12-25"), new Date("2021-12-26"), rooms[1].roomName);
      });
      it('end', () => {
        isNotAvailableBetween(new Date("2021-12-30"), new Date("2021-12-31"), rooms[1].roomName);
      });
    });
  });
});