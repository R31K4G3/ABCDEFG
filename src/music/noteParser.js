import { SEMITONES_FROM_ACCIDENTAL, SEMITONES_FROM_LETTER } from "./constants.js";

/**
 * @param {string} token
 * @param {number} pitchAdjust
 */
export function parseNote(token, pitchAdjust = 0) {
  if (!/^(?:(?:A[#\u266F]?|B)0|(?:[BE][b\u266D]?|[CF][#\u266F]?|[ADG][#b\u266D\u266F]?)[1-7]|C8)(?::[1-9]\d*)?$/.exec(token)) return null;
  /**
   * @type {{ lett: "A" | "B" | "C" | "D" | "E" | "F" | "G"; acc: "b" | "\u266D" | "#" | "\u266F"; oct: string; len: string }}
   */
  const { lett, acc, oct, len } = /^(?<lett>[A-G])(?<acc>[#\u266Fb\u266D])?(?<oct>\d)(?::(?<len>\d+))?$/.exec(token).groups;
  const semitone = SEMITONES_FROM_LETTER[lett] + (acc in SEMITONES_FROM_ACCIDENTAL ? SEMITONES_FROM_ACCIDENTAL[acc] : 0) + (+pitchAdjust);

  return {
    freq: 880 * 2 ** ((+oct) - 5 + semitone / 12),
    num: 12 * (+oct) + semitone,
    length: len ? +len : 1,
  };
}

/**
 * @param {string} text
 * @param {number} pitchAdjust
 */
export function parseScore(text, pitchAdjust) {
  const tokens = text.trim().split(/[\f\n\r\t\u000b\u0020]+/);
  return tokens.map(token => {
    const note = parseNote(token, pitchAdjust);
    if (!note) throw new Error(`invalid input: "${token}"`);
    return note;
  });
}

/**
 * @param {{ length: number }[]} array
 */
export const totalLen = array => array.reduce((s, n) => s + n.length, 0);
