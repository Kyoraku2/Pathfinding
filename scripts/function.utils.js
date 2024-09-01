/**
 * @param {number} ms - The time to sleep in milliseconds
 * @returns {Promise<void>}
 * @description This function is used to simulate a delay in the execution of the code
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number}
 * @description Generate a random number between min and max
 */
export const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 * @returns {string}
 * @description Get the cell id
 */
export const getCellId = (x, y) => x + ";" + y;

export const randomOdd = (min, max) => {
  let num = random(min, max);
  if (num % 2 === 0) {
    num += 1;
  }
  return num;
};

export const randomEven = (min, max) => {
  let num = random(min, max);
  if (num % 2 !== 0) {
    num += 1;
  }
  return num;
};
