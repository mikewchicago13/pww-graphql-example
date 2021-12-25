import {CommandService, QueryService} from "../../graphql/cqrs/bookHotelRoom";

describe('book hotel room', () => {
  it('should have free rooms', () => {
    expect(new QueryService()
      .freeRooms(new Date("2021-12-25"), new Date("2021-12-26")))
      .toHaveLength(10);
  });

  describe('should book a room', () => {
    const queryService = new QueryService();
    const rooms = queryService.freeRooms(new Date("2021-12-25"), new Date("2021-12-26"));
    const bookedRoom = rooms[0].roomName;

    it('should not have booked room available', () => {
      new CommandService().bookARoom({
        arrivalDate: new Date("2021-12-24"),
        clientId: "test",
        departureDate: new Date("2021-12-26"),
        roomName: bookedRoom
      })
      expect(queryService
        .freeRooms(new Date("2021-12-25"), new Date("2021-12-26"))
        .map(x => x.roomName))
        .not.toContain(bookedRoom);
      expect(queryService
        .freeRooms(new Date("2021-12-24"), new Date("2021-12-25"))
        .map(x => x.roomName))
        .not.toContain(bookedRoom);
      expect(queryService
        .freeRooms(new Date("2021-12-24"), new Date("2021-12-26"))
        .map(x => x.roomName))
        .not.toContain(bookedRoom);
      expect(queryService
        .freeRooms(new Date("2021-12-01"), new Date("2021-12-31"))
        .map(x => x.roomName))
        .not.toContain(bookedRoom);
    });
    it('should be available for booking after booking expires', () => {
      expect(queryService
        .freeRooms(new Date("2021-12-26"), new Date("2021-12-27"))
        .map(x => x.roomName))
        .toContain(bookedRoom);
    });
    it('should be available for booking before booking starts', () => {
      expect(queryService
        .freeRooms(new Date("2021-12-21"), new Date("2021-12-24"))
        .map(x => x.roomName))
        .toContain(bookedRoom);
    });
  });
});