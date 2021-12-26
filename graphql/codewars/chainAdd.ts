export default function add(...outerArgs: number[]): any {
  console.log("outerArgs", outerArgs);
  return function dude(...innerArgs: number[]) {
    const totalArgs = [...innerArgs, ...outerArgs];
    console.log("innerArgs", innerArgs);
    console.log("totalArgs", totalArgs);
    if (innerArgs.length === 0) {
      console.log("GATHERED_ALL_ARGS", totalArgs)
      return addNumbers(...totalArgs);
    }
    return add(...totalArgs)
  }
}

function addNumbers(...numbers: any) {
  console.log("numbers", numbers);
  return [...numbers].reduce((a, b) => a + b, 0);
}