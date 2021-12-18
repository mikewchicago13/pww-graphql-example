import {getProductsOfAllIntsExceptAtIndex} from "../getProductsOfAllIntsExceptAtIndex";

describe('max profit', () => {
  it('example case', () => {
    expect(getProductsOfAllIntsExceptAtIndex([1, 7, 3, 4])).toStrictEqual([84, 12, 28, 21]);
  });
  it('simple case', () => {
    expect(getProductsOfAllIntsExceptAtIndex([1, 2])).toStrictEqual([2, 1]);
  });
  it('simple case', () => {
    expect(getProductsOfAllIntsExceptAtIndex([0, 1, 2])).toStrictEqual([2, 0, 0]);
  });
  it('slightly more exotic simple case', () => {
    expect(getProductsOfAllIntsExceptAtIndex([1, 2, 3])).toStrictEqual([6, 3, 2]);
  });

  it('should foo', () => {
    const foo = new Set();
    foo.add(1);
    foo.add(1);
    foo.add('a');
    foo.add('a');
    foo.add(undefined);
    foo.add(undefined);
    foo.add({prop: true});
    foo.add({prop: true});
    expect(foo.size).toStrictEqual(6);
  });

  it('should bar', () => {
    let x = 'fog';
    function first(){
      console.log(x)
    }
    x = 'dog'
    function second(){
      let x = 'log'
      first();
    }
    second();
  });

  it('should bat', () => {
    function myFunction(y1, y2, ...y3){
      const [x1, ...[result]] = y3
      console.log(result)
    }
    const foo = ['a', 'b', 'c', 'd', 'e']
    myFunction(...foo);
  });
  it('should blah', () => {
    const foo = undefined;
    if(!!foo){
      console.log('something');
    }
  });
  it('should blah 2', () => {
    const foo = 'asdjkfskl';
    if(!!foo){
      console.log('something');
    }
  });

  it('should blah 3', () => {
    const obj = {
      prop: 1
    }
    console.log(obj.prop)
    Object.defineProperty(obj, 'prop', {
      writable: false,
      value: 2
    })
    console.log(obj.prop)
    obj.prop = 3;
    console.log(obj.prop)
  });

  it('should blah 4', () => {
    function Queue(){
      const array: any[] = [];
      return {
        enqueue: array.push,
        dequeue: array.shift
      }
    }
    const queue = Queue();
    queue.enqueue(1)
    queue.enqueue(2)
    const r1 = queue.dequeue() === 1;
    const r2 = queue.dequeue() === 2;

    expect(r1 && r2).toEqual(true);
  });

  it('should blah 7', () => {
    const array: any = [1, 2];
    array.customProperty = true;
    for (let i = 0; i < array.length; i++) {
      console.log(array[i])
    }
    for( const i in array){
      console.log(array[i])
    }
    array.forEach(console.log);

    // for( const i of array){
    //   console.log(array[i])
    // }
  });

  it('should iterator', () => {
    function* gen1(){
      console.log(yield 1);
      console.log(yield 2);
      console.log(yield 3);
    }
    const iterator = gen1();
    console.log(iterator.next('a').value)
    console.log(iterator.next('b').value)
    console.log(iterator.next('c').value)
  });

  it('should aklsdfjdfkls', () => {
    const arr = new Array(2);
    arr[1] = 1;
    arr[3] = 3;
    console.log("Length " + arr.length);
    for(const el of arr){
      console.log('\t', el)
    }
  });

  it('should blah', () => {
    const a = 0;
    const b = '';

    const outcome = !!(a || b || c || d);
  });

  it('should async stuff', async () => {
    async function api(){
      return new Promise(resolve => {
        setTimeout(()=> {
          resolve('b')
        }, 50)
      })
    }
    async function logger(){
      setTimeout(() => console.log('a'), 10)
      console.log(await api());
      console.log('c')
    }
    await logger();
  });

  it('should hack', () => {
    function func(a, b, cb){
      setTimeout(() => {cb(a, b)}, 1)
    }
    function callbackToPromise(foo){

    }
    const resultFunc = callbackToPromise(func);
    resultFunc.then(([value]) => console.log(value))
  });
});