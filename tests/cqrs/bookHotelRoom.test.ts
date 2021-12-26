import {CommandService, QueryService} from "../../graphql/cqrs/bookHotelRoom";
import {v4 as uuidv4} from 'uuid';

describe('book hotel room', () => {
  it('should have free rooms', () => {
    expect(new QueryService()
      .freeRooms(new Date("2021-12-25"), new Date("2021-12-26")))
      .toHaveLength(10);
  });

  describe('should book a room', () => {
    const queryService = new QueryService();
    function book(roomName: string) {
      new CommandService().bookARoom({
        arrivalDate: new Date("2021-12-24"),
        clientId: "short stay " + uuidv4(),
        departureDate: new Date("2021-12-26"),
        roomName
      })
    }

    function isNotAvailableBetween(arrival: Date, departure: Date, roomName: string) {
      book(roomName);

      expect(queryService
        .freeRooms(arrival, departure)
        .map(x => x.roomName))
        .not.toContain(roomName);
    }

    function isAvailableBetween(arrival: Date, departure: Date, roomName: string) {
      book(roomName);
      expect(queryService
        .freeRooms(arrival, departure)
        .map(x => x.roomName))
        .toContain(roomName);
    }

    it('should not be available on last day of reservation', () => {
      isNotAvailableBetween(new Date("2021-12-25"), new Date("2021-12-26"), "0");
    });
    it('should not be available on first day of reservation', () => {
      isNotAvailableBetween(new Date("2021-12-24"), new Date("2021-12-25"), "0");
    });
    it('should not be available over entire reservation', () => {
      isNotAvailableBetween(new Date("2021-12-24"), new Date("2021-12-26"), "0");
    });
    it('should not be available on span over entire duration', () => {
      isNotAvailableBetween(new Date("2021-12-01"), new Date("2021-12-31"), "0");
    });
    it('should be available immediately after the reservation expires', () => {
      isAvailableBetween(new Date("2021-12-26"), new Date("2021-12-27"), "0")
    });
    it('should be available immediately before the reservation starts', () => {
      isAvailableBetween(new Date("2021-12-21"), new Date("2021-12-24"), "0")
    });

    describe('cannot double book', () => {
      it('should blow up', () => {
        const commandService = new CommandService();
        commandService.bookARoom({
          arrivalDate: new Date("2021-12-24"),
          clientId: "short stay " + uuidv4(),
          departureDate: new Date("2021-12-26"),
          roomName: "2"
        })
        expect(() => {
          commandService.bookARoom({
            arrivalDate: new Date("2021-01-01"),
            clientId: "long stay " + uuidv4(),
            departureDate: new Date("2021-12-31"),
            roomName: "2"
          })
        }).toThrow();
      });
    });
  });
});