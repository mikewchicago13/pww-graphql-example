export class Author {
  private _id: string;
  private _firstName: string;
  private _lastName: string;

  constructor(
    id: string,
    firstName: string,
    lastName: string) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }
}


const map: Map<string, Author> = new Map<string, Author>();
[
  new Author("author-1", "Joe first", "Smith last"),
  new Author("author-2", "Sally first", "Jones last")
].forEach(value => map.set(value.id, value))

export class AuthorRepository {
  static authorById(_: unknown, {id}: { id: string }): Author {
    console.log("FIRST_PARAM_TO_AUTHOR_BY_ID " + JSON.stringify(_));
    console.log("INSIDE_AUTHOR_BY_ID " + id);

    const author = map.get(id);

    function blowUp(): Author {
      throw new Error(id + " not found");
    }

    return author || blowUp();
  }
}