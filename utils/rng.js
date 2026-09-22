// the best method for randomness is using the built-in crypto (https://nodejs.org/api/crypto.html)
const { webcrypto } = require("crypto");

module.exports = function rng() {
  // hold one 64-bit unsigned integer in an array
  const array = new BigUint64Array(1);

  // fill the array with random values
  webcrypto.getRandomValues(array);

  // M A X I M U M possible 64-bit unsigned integer (2^64 - 1)
  const maxUint64 = 18446744073709551615n;

  // cast to 64-bit floating-point number
  return (Number(array[0]) / Number(maxUint64)) * 100;
};
