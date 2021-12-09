import {GraphQLSchema} from "graphql/type/schema";
import {makeExecutableSchema} from '@graphql-tools/schema'
import Query from "./query";
import {Book} from "./bookById";
import authorById, {Author} from "./author";

export default function getSchema(): GraphQLSchema {
  const typeDefs = /* GraphQL */ `
      type Query {
          hello: Response
          goodbye ( name: String! ) : Response
          bookById ( id: ID ): Book
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
      }
  `
  function author(book: Book): Author {
    console.log(JSON.stringify(book));
    return authorById()(undefined, {id: book.authorId});
  }

  const resolvers = {
    Query: Query,

    Book: {
      author: author
    }
  }
  return makeExecutableSchema({
    typeDefs,
    resolvers
  })
}