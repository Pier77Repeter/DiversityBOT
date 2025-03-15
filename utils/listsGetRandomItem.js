// this function returns a random item from a list, if the remove parameter is true, the item is removed from the list
module.exports = function listsGetRandomItem(list, remove) {
  if (!Array.isArray(list)) {
    throw new TypeError("Expected an array");
  }
  if (list.length === 0) {
    return undefined;
  }
  const x = Math.floor(Math.random() * list.length);
  if (remove) {
    return list.splice(x, 1)[0];
  } else {
    return list[x];
  }
};
