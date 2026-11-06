import { DROP_PROTO_PROPERTY } from "../ts-util.js";

export const NOTE_COLORS = Object.freeze([
  "#c053ff", "#ff00ff", "#ff0080", "#ff0000", "#ff8000", "#c1c700",
  "#6de200", "#00e100", "#00e16d", "#00c5c6", "#4a9aff", "#5a4fff",
]);

export const KEY_COUNT = 88;

export const SEMITONES_FROM_LETTER = DROP_PROTO_PROPERTY(Object.freeze({
  __proto__: null, C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2,
}));

export const SEMITONES_FROM_ACCIDENTAL = DROP_PROTO_PROPERTY(Object.freeze({
  __proto__: null, b: -1, "\u266D": -1, "#": 1, "\u266F": 1,
}));
