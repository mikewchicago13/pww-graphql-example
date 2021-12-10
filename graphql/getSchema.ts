import {GraphQLSchema} from "graphql/type/schema";
import {makeExecutableSchema} from '@graphql-tools/schema'
import Query from "./query";
import {Book, BookRepository} from "./bookRepository";
import {Author, AuthorRepository} from "./authorRepository";
import getTypeDefs from "./getTypeDefs";

function author(book: Book): Author {
  console.log(JSON.stringify(book));
  return new AuthorRepository().authorById()(book, {id: book.authorId});
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