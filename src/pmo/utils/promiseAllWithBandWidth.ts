function promiseAllWithBandWidth<T>(
  callbacks: (() => Promise<T>)[],
  width: number = 5,
):Promise<T[]> {
  return new Promise((resolve, reject) => {
    let doneCount = 0;
    let next = width;
    const results:T[] = [];
    let canceled = false;

    const launch = (callback: () => Promise<T>, index: number) => {
      callback()
        .then((result) => {
          if (canceled) {
            return;
          }
          results[index] = result;
          doneCount += 1;
          if (next < callbacks.length) {
            launch(callbacks[next], next);
            next += 1;
          } else if (doneCount === callbacks.length) {
            resolve(results);
          }
        })
        .catch((e) => {
          canceled = true;
          reject(e);
        });
    };

    for (let i = 0; i < width; i += 1) {
      launch(callbacks[i], i);
    }
  });
}

export default promiseAllWithBandWidth;
