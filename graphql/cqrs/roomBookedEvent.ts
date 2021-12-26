import {Event} from "./eventNotifications";

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
}