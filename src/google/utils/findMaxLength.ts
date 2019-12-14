const findMaxLength = (arrayOfArrays: any[][]): number =>
  arrayOfArrays.reduce((accumulator: number, array: any[]) => {
    if (accumulator < array.length) {
      return array.length;
    }
    return accumulator;
  }, arrayOfArrays[0].length);

export default findMaxLength;
