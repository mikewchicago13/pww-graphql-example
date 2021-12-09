

export class Book {
  private _id: string;
  private _title: string;
  private _pageCount: number;
  private _authorId: string;

  constructor(
    id: string,
    title: string,
    pageCount: number,
    authorId: string) {
    this._id = id;
    this._title = title;
    this._pageCount = pageCount;
    this._authorId = authorId;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get pageCount(): number {
    return this._pageCount;
  }

  set pageCount(value: number) {
    this._pageCount = value;
  }

  get authorId(): string {
    return this._authorId;
  }

  set authorId(value: string) {
    this._authorId = value;
  }
}

export default function bookById(): (
  _: unknown,
  {id}: { id: string }
) => Book {
  return (_, {id}: { id: string }): Book => {
    console.log("INSIDE_BOOK_BY_ID " + id);
    const array = [
      new Book("book-1", "title 1", 1, "author-1"),
      new Book("book-2", "title 2", 2, "author-2")
    ];

    const map: Map<string, Book> = new Map<string, Book>();
    array.forEach(value => map.set(value.id, value))

    const book = map.get(id);

    function blowUp(): Book {
      throw new Error(id + " not found");
    }

    return book || blowUp();
  };
}