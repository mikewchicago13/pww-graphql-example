export default function add(x: number): any {
  const func = function (): any {
    const args = Array.prototype.slice.call(arguments);
    return add(args.reduce((a: number, b: number) => a + b, x))
  };
  func.valueOf = () => x
  return func
}
