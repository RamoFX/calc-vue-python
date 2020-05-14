const isArray = (arr: any[]): boolean => {
  return Array.isArray(arr)
}

const isObject = (obj: Object): boolean => {
  return typeof obj === 'object' && obj !== null
}

// Are two objects the same?
const objEqual = (obj1: Object, obj2: Object): boolean => {

  return JSON.stringify(obj1) == JSON.stringify(obj2) ? true : false

}

// range(5, 7) -> [5, 6], range(5, 7, true) -> [5, 6, 7]
const range = (from: number, to: number, include: boolean = false): Array<number> => {
  include === true ? to++ : null

  let rangeArray = []

  let i = from
  while(i < to) {
    rangeArray.push(i)
    i++
  }

  return rangeArray
}
