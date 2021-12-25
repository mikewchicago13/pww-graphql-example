import {QueryService} from "../../graphql/cqrs/bookHotelRoom";

describe('book hotel room', () => {
  it('should have free rooms', () => {
    expect(new QueryService().freeRooms(new Date("2021-12-25"), new Date("2021-12-26")))
      .toHaveLength(10);
  });
});