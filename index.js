const { bubbleSort, mergeSort, quickSort } = require("./sortAlgorithms");
const parallelSort = require("./parallelSort");
const { performance } = require("perf_hooks");

const generateArray = (size) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * size));

(async () => {
  /*
   *  Soring array with bubble sort and parallel bubble sort
   */

  const bubbleArray = generateArray(100000);
  let bubbleParallelTimeExec = performance.now();
  const sortedParallelBubble = await parallelSort(
    bubbleSort,
    [...bubbleArray],
    10
  );
  bubbleParallelTimeExec = performance.now() - bubbleParallelTimeExec;

  let bubbleTimeExec = performance.now();
  const sortedBubble = bubbleSort([...bubbleArray]);
  bubbleTimeExec = performance.now() - bubbleTimeExec;

  console.log(
    "Parallel = Bubble?:",
    JSON.stringify(sortedParallelBubble) === JSON.stringify(sortedBubble)
  );
  console.log(`Bubble sort execution time: ${bubbleTimeExec} ms`);
  console.log(`Parallel Bubble: ${bubbleParallelTimeExec} ms`);
  console.log(
    `Speedup: ${(bubbleParallelTimeExec / bubbleTimeExec).toFixed(2)}`
  );
  console.log("\n");

  /*
   *  Soring array with merge sort and parallel merge sort
   */

  const mergeArray = generateArray(20000000);

  let mergeParallelTimeExec = performance.now();
  const sortedParallelMerge = await parallelSort(
    mergeSort,
    [...mergeArray],
    10
  );
  mergeParallelTimeExec = performance.now() - mergeParallelTimeExec;

  let mergeTimeExec = performance.now();
  const sortedMerge = mergeSort([...mergeArray]);
  mergeTimeExec = performance.now() - mergeTimeExec;

  console.log(
    "Parallel = Merge?:",
    JSON.stringify(sortedParallelMerge) === JSON.stringify(sortedMerge)
  );
  console.log(`Merge sort execution time: ${mergeTimeExec} ms`);
  console.log(`Parallel Merge: ${mergeParallelTimeExec} ms`);
  console.log(`Speedup: ${(mergeParallelTimeExec / mergeTimeExec).toFixed(2)}`);
  console.log("\n");

  /*
   *  Soring array with merge sort and parallel merge sort
   */

  const quickArray = generateArray(20000000);

  let quickParallelTimeExec = performance.now();
  const sortedParallelQuick = await parallelSort(
    quickSort,
    [...quickArray],
    10
  );
  quickParallelTimeExec = performance.now() - quickParallelTimeExec;

  let quickTimeExec = performance.now();
  const sortedQuick = quickSort([...quickArray]);
  quickTimeExec = performance.now() - quickTimeExec;

  console.log(
    "Parallel = Quick?:",
    JSON.stringify(sortedParallelQuick) === JSON.stringify(sortedQuick)
  );
  console.log(`Quick sort execution time: ${quickTimeExec} ms`);
  console.log(`Parallel Quick: ${quickParallelTimeExec} ms`);
  console.log(`Speedup: ${(quickParallelTimeExec / quickTimeExec).toFixed(2)}`);
})();
