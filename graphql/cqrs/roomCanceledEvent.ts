import {Event} from "./eventNotifications";

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
}