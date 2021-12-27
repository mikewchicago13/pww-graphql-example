declare global {
  namespace jest {
    interface Matchers<R> {
      toBeGreaterThanAny(x: any): R;

      toBeGreaterThanOrEqualAny(x: any): R;

      toBeLessThanAny(x: any): R;

      toBeLessThanOrEqualAny(x: any): R;

      toDoubleEqual(x: any): R;
    }
  }
}
export {};