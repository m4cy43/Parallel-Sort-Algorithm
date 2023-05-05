const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");
const { performance } = require("perf_hooks");
const arraySize = 50000;
const subarrayNum = 6;

function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

function mergeSortedArrays(arrays) {
  const result = [];
  const indexes = new Array(arrays.length).fill(0);

  while (indexes.some((index, i) => index < arrays[i].length)) {
    let min = Infinity;
    let minIndex = -1;
    for (let i = 0; i < arrays.length; i++) {
      if (indexes[i] < arrays[i].length && arrays[i][indexes[i]] < min) {
        min = arrays[i][indexes[i]];
        minIndex = i;
      }
    }
    result.push(min);
    indexes[minIndex]++;
  }

  return result;
}

if (isMainThread) {
  const array = [];
  const array2 = [];
  for (let i = 0; i < arraySize; i++) {
    const num = Math.floor(Math.random() * 10000);
    array.push(num);
    array2.push(num);
  }

  const start = performance.now();
  bubbleSort(array2);
  const timeRegular = performance.now() - start;

  const subarrays = new Array(subarrayNum);
  const chunkSize = Math.ceil(array.length / subarrays.length);
  for (let i = 0; i < subarrays.length; i++) {
    subarrays[i] = array.slice(i * chunkSize, (i + 1) * chunkSize);
  }

  const startParallel = performance.now();
  const workers = new Array(subarrays.length);
  for (let i = 0; i < workers.length; i++) {
    workers[i] = new Worker(__filename, { workerData: subarrays[i] });
  }

  const sortedSubarrays = new Array(workers.length);
  for (let i = 0; i < workers.length; i++) {
    sortedSubarrays[i] = new Promise((resolve) => {
      workers[i].on("message", (sortedSubarray) => {
        resolve(sortedSubarray);
      });
    });
    workers[i].on("error", (err) => {
      throw err;
    });
    workers[i].on("exit", (code) => {
      if (code !== 0) {
        throw new Error(`Worker stopped with exit code ${code}`);
      }
    });
  }

  Promise.all(sortedSubarrays).then((sortedSubarrays) => {
    const sortedArray = mergeSortedArrays(sortedSubarrays);
    const timeParallel = performance.now() - startParallel;

    console.log(
      `Parallel sorted array (size - ${arraySize} workers - ${subarrayNum}):`
    );
    console.log(sortedArray);
    console.log(`Regular sorted array (size - ${arraySize}):`);
    console.log(array2);
    console.log(
      "Does result the same?:",
      JSON.stringify(sortedArray) === JSON.stringify(array2)
    );
    console.log(`Parallel time: ${timeParallel} ms`);
    console.log(`Regular time: ${timeRegular} ms`);
    console.log(`SpeedUp: ${timeRegular / timeParallel}`);
  });
} else {
  const sortedSubarray = bubbleSort(workerData);
  parentPort.postMessage(sortedSubarray);
}
