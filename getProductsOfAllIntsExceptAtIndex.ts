export function getProductsOfAllIntsExceptAtIndex(numbers: number[]): number[] {
  const numbersReplacedWithOneForMultiplication: number[] = new Array(numbers.length);

  for (let i = 0; i < numbers.length; i++) {
    numbersReplacedWithOneForMultiplication[i] = numbers.slice(0, i).concat(numbers.slice(i + 1))
      .reduce((a, b) => a * b, 1);
  }
  return numbersReplacedWithOneForMultiplication;
}