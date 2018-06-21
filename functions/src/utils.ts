export const asyncForEach = async (array: any, cb: any) => {
  for (let index = 0; index < array.length; index++) {
    await cb(array[index], index, array);
  }
};
