import { NOTE_COLORS, KEY_COUNT } from "../music/constants.js";
import { totalLen } from "../music/noteParser.js";

const HEIGHT = 576;
const MAX_WIDTH = 16384;

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} rows
 * @param {number} cols
 * @param {number} rowMod
 * @param {number} rowRem
 * @param {number} colMod
 * @param {number} colRem
 */
function drawGrid(ctx, rows, cols, rowMod, rowRem, colMod, colRem) {
  const { height, width } = ctx.canvas;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  /**
   * @param {boolean} strong
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  const line = (strong, x1, y1, x2, y2) => {
    ctx.strokeStyle = strong ? "#666666" : "#333333";
    ctx.lineWidth = strong ? 3 : 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  for (let i = 1; i < rows; i++) {
    const y = i / rows * height;
    line(i % rowMod === rowRem, width, y, 0, y);
  }
  for (let i = 1; i < cols; i++) {
    const x = i / cols * width;
    line(i % colMod === colRem, x, 0, x, height);
  }
}

export function createPianoRoll() {
  const element = document.createElement("div");
  element.className = "roll";
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 9;
  element.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  /**
   * @param {{ num: number; length: number }[]} notes
   */
  function draw(notes) {
    const ticks = totalLen(notes);
    canvas.width = Math.min(MAX_WIDTH, 16 * ticks);
    canvas.height = HEIGHT;
    drawGrid(ctx, KEY_COUNT, ticks, 12, 1, 16, 0);

    let tick = 0;
    for (const { num, length } of notes) {
      if (num >= 0 && num < KEY_COUNT) {
        ctx.fillStyle = NOTE_COLORS[num % 12];
        ctx.fillRect(
          tick / ticks * canvas.width + 1,
          (KEY_COUNT - 1 - num) / KEY_COUNT * canvas.height,
          length * canvas.width / ticks - 2,
          canvas.height / KEY_COUNT
        );
      }
      tick += length;
    }
  }

  return { element, draw };
}
