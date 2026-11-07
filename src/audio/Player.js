import { Channel } from "./Channel.js";

export class Player extends EventTarget {
  #ctx;
  #master;

  /** @type {Channel[]} */
  #channels = [];

  /** @type {number} */
  #volume = 0.06;

  constructor() {
    super();
    this.#ctx = new AudioContext();
    this.#master = this.#ctx.createGain();
    this.#master.gain.value = this.#volume;
    this.#master.connect(this.#ctx.destination);
  }

  /**
   * @param {number} v
   */
  setVolume(v) {
    this.#volume = v;
    if (!this.#master) return;
    this.#master.gain.setTargetAtTime(v, this.#master.context.currentTime, 0.01);
  }

  /**
   * @param {{ notes: { freq: number; length: number }[]; wave: "sawtooth" | "sine" | "square" | "triangle" }[]} tracks
   * @param {number} tickSec
   */
  async play(tracks, tickSec) {
    await this.#ctx.resume();
    this.stop();
    const start = this.#ctx.currentTime + 0.05;
    while (this.#channels.length < tracks.length) {
      this.#channels.push(new Channel(this.#ctx, this.#master));
    }
    if (this.#channels.length > tracks.length) {
      this.#channels.length = tracks.length;
    }
    this.#channels.forEach((ch, i) => {
      ch.play(tracks[i].notes, start, tickSec, tracks[i].wave);
      ch.addEventListener("ended", () => {
        this.dispatchEvent(new CustomEvent("ended"));
      }, { once: true });
    });
  }

  stop() {
    this.#channels.forEach(ch => ch.stop());
  }
}
