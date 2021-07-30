export const getMean = (numbers: Array<number>) =>
  numbers.length && numbers.reduce((a, b) => a + b) / numbers.length;

export const getStd = (numbers: Array<number>) =>
  Math.sqrt(
    numbers
      .map((x) => Math.pow(x - getMean(numbers), 2))
      .reduce((a, b) => a + b) / numbers.length
  );

export const getMedian = (numbers: Array<number>) => {
  const arrSort = numbers.sort();
  const mid = Math.ceil(numbers.length / 2);
  return numbers.length % 2 == 0
    ? (arrSort[mid] + arrSort[mid - 1]) / 2
    : arrSort[mid - 1];
};

export const getZscore = (numbers: Array<number>, input: number) => {
  const mean = getMean(numbers);
  const std = getStd(numbers);
  return (input - mean) / std;
};
