import {v4 as uuidv4} from 'uuid';
import {CommandService} from "../../graphql/cqrs/commandService";
import {QueryService} from "../../graphql/cqrs/queryService";

describe('book hotel room', () => {
  it('should have free rooms', () => {
    expect(new QueryService()
      .freeRooms(new Date("2021-12-25"), new Date("2021-12-26")))
      .toHaveLength(10);
  });

  describe('should book a room', () => {
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

      expect(new QueryService()
        .freeRooms(arrival, departure)
        .map(x => x.roomName))
        .not.toContain(roomName);
    }

    function isAvailableBetween(arrival: Date, departure: Date, roomName: string) {
      book(roomName);
      expect(new QueryService()
        .freeRooms(arrival, departure)
        .map(x => x.roomName))
        .toContain(roomName);
    }

    it('should not be available on last day of reservation', () => {
      isNotAvailableBetween(new Date("2021-12-25"), new Date("2021-12-26"), "0");
    });
    it('should not be available on first day of reservation', () => {
      isNotAvailableBetween(new Date("2021-12-24"), new Date("2021-12-25"), "1");
    });
    it('should not be available over entire reservation', () => {
      isNotAvailableBetween(new Date("2021-12-24"), new Date("2021-12-26"), "2");
    });
    it('should not be available on span over entire duration', () => {
      isNotAvailableBetween(new Date("2021-12-01"), new Date("2021-12-31"), "3");
    });
    it('should be available immediately after the reservation expires', () => {
      isAvailableBetween(new Date("2021-12-26"), new Date("2021-12-27"), "4")
    });
    it('should be available immediately before the reservation starts', () => {
      isAvailableBetween(new Date("2021-12-21"), new Date("2021-12-24"), "5")
    });

    describe('cannot double book', () => {
      it('should blow up', () => {
        new CommandService().bookARoom({
          arrivalDate: new Date("2021-12-24"),
          clientId: "short stay " + uuidv4(),
          departureDate: new Date("2021-12-26"),
          roomName: "6"
        })
        expect(() => {
          new CommandService().bookARoom({
            arrivalDate: new Date("2021-01-01"),
            clientId: "long stay " + uuidv4(),
            departureDate: new Date("2021-12-31"),
            roomName: "6"
          })
        }).toThrow();
      });
    });
  });
});

afterEach(() => {
  new CommandService().cancelEverything();
  expect(new QueryService()
    .freeRooms(new Date("1970-01-01"), new Date("3000-01-01")))
    .toHaveLength(10);
})