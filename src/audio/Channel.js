const STEPS = Array.from({ __proto__: null, length: 8 }, (_, i) => 1 / 3 + 2 * 3 ** -(1 + i / 4));
const CURVE = Float32Array.from({ __proto__: null, length: 64 }, (_, i) => STEPS[Math.floor(i / 8)]);

const RELEASE_SEC = 0.01;

export class Channel extends EventTarget {
  #ctx;
  #destination;

  /** @type {{ osc: OscillatorNode; fade: GainNode } | null} */
  #current = null;

  /**
   * @param {AudioContext} ctx
   * @param {AudioNode} destination
   */
  constructor(ctx, destination) {
    super();
    this.#ctx = ctx;
    this.#destination = destination;
  }

  /**
   * @param {{ freq: number; length: number }[]} notes
   * @param {number} startTime
   * @param {number} tickSec
   * @param {"sawtooth" | "sine" | "square" | "triangle"} wave
   */
  play(notes, startTime, tickSec, wave) {
    this.stop();

    const osc = this.#ctx.createOscillator();
    const envelope = this.#ctx.createGain();
    const fade = this.#ctx.createGain();
    osc.type = wave;
    osc.connect(envelope).connect(fade).connect(this.#destination);

    envelope.gain.setValueAtTime(0, startTime);
    let t = startTime;
    for (const { freq, length } of notes) {
      osc.frequency.setValueAtTime(freq, t);
      envelope.gain.setValueCurveAtTime(CURVE, t, tickSec * 0.999);
      t += length * tickSec;
    }
    envelope.gain.setValueAtTime(0, t);

    osc.start(startTime);
    osc.stop(t);
    osc.onended = () => {
      osc.onended = null;
      osc.disconnect();
      envelope.disconnect();
      fade.disconnect();
      if (this.#current?.osc === osc) {
        this.#current = null;
        this.dispatchEvent(new CustomEvent("ended"));
      }
    };
    this.#current = { osc, fade };
  }

  stop() {
    if (!this.#current) return;
    const { osc, fade } = this.#current;
    const now = this.#ctx.currentTime;
    fade.gain.setTargetAtTime(0, now, RELEASE_SEC / 3);
    try {
      osc.stop(now + RELEASE_SEC * 2);
    } catch {
      // already stopped
    }
    this.#current = null;
    this.dispatchEvent(new CustomEvent("ended"));
  }
}
