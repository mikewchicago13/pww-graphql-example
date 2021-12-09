import path from "path";
import {readFileSync} from "fs";
import {buildSchema} from "graphql";
import {GraphQLSchema} from "graphql/type/schema";

export default function getSchema(): GraphQLSchema {
  const fullPath = path.join(__dirname, "schema.graphqls");
  const contents = readFileSync(fullPath).toString();
  console.log(contents);
  return buildSchema(contents);
}