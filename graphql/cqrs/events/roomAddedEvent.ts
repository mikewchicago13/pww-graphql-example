import {Event} from "../eventNotifications";

export class RoomAddedEvent implements Event {
  private readonly _roomName: string;

  constructor(roomName: string) {
    this._roomName = roomName;
  }

  get roomName(): string {
    return this._roomName;
  }
}