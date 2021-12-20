export default class Response {
  get contents(): string {
    return this._contents;
  }

  set contents(value: string) {
    this._contents = value;
  }

  private _contents: string;

  constructor(contents: string) {
    this._contents = contents;
  }
}