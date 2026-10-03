// basic but dont want to rewrite it 4 times
module.exports = function getRarityLabel(chance) {
  if (chance <= 0.1) return "Pray RNGesus";
  if (chance <= 1 && chance > 0.1) return "Ask John RNG";
  if (chance <= 3 && chance > 1) return "Extraordinary";
  if (chance <= 10 && chance > 3) return "Rare";
  if (chance <= 20 && chance > 10) return "Occasional";
  return "Common";
};
