import {GraphQLSchema} from "graphql/type/schema";
import {makeExecutableSchema} from '@graphql-tools/schema'
import Query from "./query";
import {Book, BookRepository} from "./bookRepository";
import {Author, AuthorRepository} from "./authorRepository";

function getTypeDefs(): string {
  return /* GraphQL */ `
      type Query {
          hello: Response
          goodbye ( name: String! ) : Response
          bookById ( id: ID ): Book
          authorById ( id: ID ): Author
      }

      type Response {
          contents: String
      }

      type Book {
          id: ID
          title: String
          pageCount: Int
          author: Author
      }

      type Author {
          id: ID
          firstName: String
          lastName: String
          books: [Book]
      }
  `;
}

function author(book: Book): Author {
  console.log(JSON.stringify(book));
  return new AuthorRepository().authorById()(undefined, {id: book.authorId});
}

function books(author: Author): Book[] {
  console.log(JSON.stringify(author));
  return new BookRepository().booksWrittenBy(author.id);
}

function getResolvers(): any {
  return {
    Query: Query,
    Book: {
      author
    },
    Author: {
      books
    }
  };
}

export default function getSchema(): GraphQLSchema {
  return makeExecutableSchema({
    typeDefs: getTypeDefs(),
    resolvers: getResolvers()
  })
}