// splits a name into visible character groups so joined emoji count as one character
const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
// recognizes emoji symbols, flags, and keycap emoji in each character group
const emojiPattern = /[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Regional_Indicator}]|\u20e3/u;

// this utility functions is used to parse and validate new rng names such as "🪙 Golden Coin" (Valid) or "🪙🪙 Golden🪙🪙 Coin" (NOT VALID)
// also when getting the drops by name we need to remove the emoji at the beginning
function normalizeDropName(name) {
  const trimmedName = name.trim();
  // segment by visible characters so joined emoji (like 👩‍🚀) stay together
  const graphemes = Array.from(graphemeSegmenter.segment(trimmedName), ({ segment }) => segment);
  const firstGrapheme = graphemes[0];

  // ignore a leading emoji when comparing a drop name, but keep emoji elsewhere intact
  if (firstGrapheme && emojiPattern.test(firstGrapheme)) {
    return graphemes.slice(1).join("").trim().toLowerCase();
  }

  return trimmedName.toLowerCase();
}

function isValidDropName(name) {
  const emojiGraphemeIndexes = [];
  let index = 0;

  // only a single emoji at the beginning is allowed, names also need text after it
  for (const { segment } of graphemeSegmenter.segment(name)) {
    if (emojiPattern.test(segment)) emojiGraphemeIndexes.push(index);
    index++;
  }

  const hasOnlyOneLeadingEmoji = emojiGraphemeIndexes.length === 0 || (emojiGraphemeIndexes.length === 1 && emojiGraphemeIndexes[0] === 0);

  return normalizeDropName(name).length > 0 && hasOnlyOneLeadingEmoji;
}

module.exports = { normalizeDropName, isValidDropName };
