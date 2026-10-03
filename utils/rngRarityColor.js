// same as getRarityLabel()
module.exports = function getRarityColor(chance) {
  if (chance <= 0.1) return 0xff5555;
  if (chance <= 1 && chance > 0.1) return 0xff55ff;
  if (chance <= 3 && chance > 1) return 0xa335ee;
  if (chance <= 10 && chance > 3) return 0x55ffff;
  if (chance <= 20 && chance > 10) return 0x459bff;
  return 0x2ecc71;
};
