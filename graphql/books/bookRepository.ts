import {v4 as uuidv4} from 'uuid';

export class Book {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _pageCount: number;
  private readonly _authorId: string;

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

  get title(): string {
    return this._title;
  }

  get pageCount(): number {
    return this._pageCount;
  }

  get authorId(): string {
    return this._authorId;
  }

  methodOnEntity({param1}: { param1: string }) {
    const result = "Method on entity called with " + param1;
    console.log(result);
    return result;
  }
}

const map: Map<string, Book> = new Map<string, Book>();

function addBook(value: Book): void {
  map.set(value.id, value);
}

[
  new Book("book-1", "title 1", 1, "author-1"),
  new Book("book-2", "title 2", 2, "author-2")
].forEach(value => addBook(value));

export class BookRepository {
  static addBook(_: unknown,
                 {title, pageCount, authorId}:
                   { title: string, pageCount: number, authorId: string }) : Book {
    const book = new Book(uuidv4(), title, pageCount, authorId);
    addBook(book);
    return book;
  }

  static bookById(
    _: unknown,
    {id}: { id: string }
  ): Book {
    console.log("FIRST_PARAM_TO_BOOK_BY_ID " + JSON.stringify(_));
    console.log("INSIDE_BOOK_BY_ID " + id);
    const book = map.get(id);

    function blowUp(): Book {
      throw new Error(id + " not found");
    }

    return book || blowUp();
  }

  static booksWrittenBy(authorId: string): Book[] {
    console.log("INSIDE_BOOKS_WRITTEN_BY " + authorId);
    return [...map]
      .map(([_, book]): Book => book)
      .filter(book => authorId == book.authorId)
  }
}