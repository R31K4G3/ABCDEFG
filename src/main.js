// @ts-check

import { Player } from "./audio/Player.js";
import { parseScore } from "./music/noteParser.js";
import { createSlider } from "./ui/slider.js";
import { createScoreEditor } from "./ui/scoreEditor.js";
import { createPianoRoll } from "./ui/pianoRoll.js";
import songs from "./songs/index.js";

const player = new Player();

const volume = createSlider({
  label: "The volume of audio", min: 0, max: 100, value: 6,
  format: v => `${v}%`,
  onInput: v => player.setVolume(v / 100),
});
const tempo = createSlider({
  label: "The length of sixteenth notes", min: 20, max: 80, value: 36, format: v => `${v / 400} s`,
});
const pitch = createSlider({
  label: "Pitch adjustment", min: -6, max: 6, value: 0, format: v => `${v}`,
});

document.getElementById("controls").append(volume.element, tempo.element, pitch.element);

let editors = [];
let rolls = [];

document.getElementById("editors").replaceChildren();
const rollsElm = document.getElementById("rolls");
rollsElm.replaceChildren();
editors = songs[0].tracks.map(t => createScoreEditor(t.notes));
rolls = songs[0].tracks.map(() => createPianoRoll());
document.getElementById("editors").append(...editors.map(e => e.element));
rollsElm.append(...rolls.map(r => r.element));

let dragging = false;
document.addEventListener("mousedown", e => {
  if (rollsElm === e.target || rollsElm.contains(e.target)) dragging = true;
});
document.addEventListener("mouseup", () => { dragging = false; });
document.addEventListener("mousemove", e => {
  if (dragging) rollsElm.scrollLeft -= e.movementX;
});

document.getElementById("start").addEventListener("click", async () => {
  const tracks = editors.map((e, i) => {
    return { notes: parseScore(e.getText(), pitch.value), wave: songs[0].tracks[i].wave };
  });
  tracks.forEach((t, i) => rolls[i].draw(t.notes));
  await player.play(tracks, tempo.value / 400);
});
document.getElementById("stop").addEventListener("click", () => player.stop());
