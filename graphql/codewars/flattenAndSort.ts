export function flattenAndSort(inputArray: number[][]): number[] {
  return inputArray
    .reduce((a, b) => [...a, ...b], [])
    .sort((a, b) => a - b);
}