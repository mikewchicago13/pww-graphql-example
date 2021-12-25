import {Card} from "./card";
import {HandMatchResult} from "./handMatchResult";

export interface HandType {
  parse(cards: Card[]): HandMatchResult;

  toString(): string;
}