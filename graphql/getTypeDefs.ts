import path from "path";
import {EOL} from "os";
import {readFileSync} from "fs";

export default function getTypeDefs(): string {
  const fullPath = path.join(".", "schema.graphqls");
  const contents = readFileSync(fullPath).toString();
  console.log("SCHEMA " + EOL + contents);
  return contents;
}