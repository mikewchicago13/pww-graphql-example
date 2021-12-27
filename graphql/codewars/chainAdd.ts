export default function add(x: number): any {
  const func = function (y: number): any {
    return add(x + y)
  };
  func.valueOf = () => x
  func.toString = () => `func with valueOf ${x}`
  return func
}
