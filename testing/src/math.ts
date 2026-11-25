
export function sum(a: number, b: number) {
    return a + b;
}

export function isEven(n : number){
    return  n % 2 === 0;
}


export function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}