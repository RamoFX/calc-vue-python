const objEqual = (object1, object2):boolean | void => {

  let objects = [object1, object2]

  for(let object of objects) {
    if(typeof(object) != 'object' || object == [] || object == undefined) {
      throw new Error(`Helpers -> objEqual(object1, object2): Only arguments of type object are acceptable, got: '${object}', type: '${typeof(object)}'.`)
      return null
    }
  }

  if(JSON.stringify(object1) == JSON.stringify(object2)) {
    return true
  } else {
    return false
  }

}
