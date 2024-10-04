const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");
const { merge } = require("./sortAlgorithms");

// Master node code
if (isMainThread) {
  module.exports = async function (f, arrayToSort, workerNum) {
    // Split array into N subArrays
    const subArrays = new Array(workerNum);
    const chunkSize = Math.ceil(arrayToSort.length / workerNum);
    for (let i = 0; i < subArrays.length; i++) {
      subArrays[i] = arrayToSort.slice(i * chunkSize, (i + 1) * chunkSize);
    }

    // Creating N workers (N = subArrays num)
    const workers = subArrays.map((subArray) => {
      // Promises needed to await all subarrays
      return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: {
            array: subArray,
            fString: f.toString(), // Workers can't accept functions, so we need to cheat
          },
        });

        // Slave nodes event listening
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    });

    // Await all workers to finish sorting their subarrays
    const sortedSubarrays = await Promise.all(workers);

    // Merge sorted subArrays
    let sortedArray = [];
    sortedSubarrays.forEach((sortedSubarray) => {
      sortedArray = merge(sortedArray, sortedSubarray);
    });

    return sortedArray;
  };
} else {
  // Slave nodes code
  const { array, fString } = workerData;
  // Workers can't accept functions, so we need to cheat
  const f = new Function("return " + fString)();

  const sortedSubarray = f(array);
  parentPort.postMessage(sortedSubarray);
}
