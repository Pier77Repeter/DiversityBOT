// improved version of the old delay, better here instead of rewriting it everytime
module.exports = function delay(ms) {
  if (typeof ms !== "number" || ms < 0) {
    return Promise.reject(new Error("Invalid delay duration."));
  }

  let timeoutId;

  const promise = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, ms);
  });

  promise.cancel = () => {
    clearTimeout(timeoutId);
  };

  return promise;
};
