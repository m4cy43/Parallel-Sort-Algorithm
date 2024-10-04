const { bubbleSort, mergeSort, quickSort } = require("./sortAlgorithms");
const parallelSort = require("./parallelSort");
const { performance } = require("perf_hooks");

const generateArray = (size) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * size));

(async () => {
  const workerNum = 10;
  /*
   *  Soring array with bubble sort and parallel bubble sort
   */
  const bubbleArraySize = 100000;
  const bubbleArray = generateArray(bubbleArraySize);

  let bubbleParallelTimeExec = performance.now();
  const sortedParallelBubble = await parallelSort(
    bubbleSort,
    [...bubbleArray],
    workerNum
  );
  bubbleParallelTimeExec = performance.now() - bubbleParallelTimeExec;

  let bubbleTimeExec = performance.now();
  const sortedBubble = bubbleSort([...bubbleArray]);
  bubbleTimeExec = performance.now() - bubbleTimeExec;

  console.log(`Array size: ${bubbleArraySize}`);
  console.log(
    "Parallel = Bubble?:",
    JSON.stringify(sortedParallelBubble) === JSON.stringify(sortedBubble)
  );
  console.log(`Bubble sort execution time: ${bubbleTimeExec} ms`);
  console.log(`Parallel Bubble: ${bubbleParallelTimeExec} ms`);
  console.log(
    `Speedup: ${(bubbleTimeExec / bubbleParallelTimeExec).toFixed(2)}`
  );
  console.log("\n");

  /*
   *  Soring array with merge sort and parallel merge sort
   */
  const mergeArraySize = 20000000;
  const mergeArray = generateArray(mergeArraySize);

  let mergeParallelTimeExec = performance.now();
  const sortedParallelMerge = await parallelSort(
    mergeSort,
    [...mergeArray],
    workerNum
  );
  mergeParallelTimeExec = performance.now() - mergeParallelTimeExec;

  let mergeTimeExec = performance.now();
  const sortedMerge = mergeSort([...mergeArray]);
  mergeTimeExec = performance.now() - mergeTimeExec;

  console.log(`Array size: ${mergeArraySize}`);
  console.log(
    "Parallel = Merge?:",
    JSON.stringify(sortedParallelMerge) === JSON.stringify(sortedMerge)
  );
  console.log(`Merge sort execution time: ${mergeTimeExec} ms`);
  console.log(`Parallel Merge: ${mergeParallelTimeExec} ms`);
  console.log(`Speedup: ${(mergeTimeExec / mergeParallelTimeExec).toFixed(2)}`);
  console.log("\n");

  /*
   *  Soring array with merge sort and parallel merge sort
   */
  const quickArraySize = 20000000;
  const quickArray = generateArray(quickArraySize);

  let quickParallelTimeExec = performance.now();
  const sortedParallelQuick = await parallelSort(
    quickSort,
    [...quickArray],
    workerNum
  );
  quickParallelTimeExec = performance.now() - quickParallelTimeExec;

  let quickTimeExec = performance.now();
  const sortedQuick = quickSort([...quickArray]);
  quickTimeExec = performance.now() - quickTimeExec;

  console.log(`Array size: ${quickArraySize}`);
  console.log(
    "Parallel = Quick?:",
    JSON.stringify(sortedParallelQuick) === JSON.stringify(sortedQuick)
  );
  console.log(`Quick sort execution time: ${quickTimeExec} ms`);
  console.log(`Parallel Quick: ${quickParallelTimeExec} ms`);
  console.log(`Speedup: ${(quickTimeExec / quickParallelTimeExec).toFixed(2)}`);
})();
