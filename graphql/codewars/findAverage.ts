export function findAverage(array: number[]): number {
  return array.length ? array.reduce((a, b) => a + b, 0) / array.length : 0
}
