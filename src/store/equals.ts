export const shallowEquals = (a: any, b: any) => a === b;
export const arePrimitives = (...objects: any[]) => objects.every(o => !(o instanceof Object));

const comparator = (a: any, b: any): boolean | null => {
  if (shallowEquals(a, b)) return true;
  if (arePrimitives(a, b)) return false;
  return null;
};

export const deepEquals = (a: any, b: any): boolean => {
  const topEqual = comparator(a, b);
  if (typeof topEqual === 'boolean') return topEqual;


  // Create iterators which will iterate over the objects and the children of the objects
  const objectAIterator = [a];
  const objectBIterator = [b];

  for (let objectIndex = 0; objectIndex < objectAIterator.length; ++objectIndex) {

    // Get the objects themselves
    const objectA = objectAIterator[objectIndex];
    const objectB = objectBIterator[objectIndex];

    // Get the keys of the objects
    const keysA = Object.keys(objectA);
    const keysB = Object.keys(objectB);

    // Objects don't have the same amount of keys
    if (keysA.length !== keysB.length) return false;

    for (let index = 0; index < keysA.length; ++index) {
      const keyA = keysA[index];
      // One of the keys are not the same
      if (!(keyA in objectB)) return false;

      // Save the values of the keys
      const objectAValue = objectA[keyA];
      const objectBValue = objectB[keyA];

      // Compare the values
      const areEqual = comparator(objectAValue, objectBValue);

      // One of the values are not the same
      if (areEqual === false) return false;
      // Values cannot be compared, because the keys are objects themselves.
      // Therefore, add them to the iterators and comare them again
      if (areEqual === null) {
        objectAIterator.push(objectAValue);
        objectBIterator.push(objectBValue);
      }
    }
  }
  return true;
};

export const recursiveEquals = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (arePrimitives(a, b)) return false;
  const keyA = Object.keys(a);
  const keyB = Object.keys(b);
  if (keyA.length !== keyB.length) return false;
  for (let i = 0; i < keyA.length; ++i) {
    const key = keyA[i];
    if (!(key in b)) return false;
    if (!recursiveEquals(a[key], b[key])) return false;
  }
  return true;
};
