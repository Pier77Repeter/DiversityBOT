module.exports = function randomColor() {
  const num = Math.floor(Math.random() * Math.pow(2, 24));
  const hex = ("00000" + num.toString(16)).slice(-6);
  return parseInt(hex, 16);
};
