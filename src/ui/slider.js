/**
 * @param {{ label: string; min: number; max: number; value: number; format(value: number): string; onInput?(value: number): void }} params
 */
export function createSlider({ label, min, max, value, format, onInput }) {
  const element = document.createElement("div");
  element.className = "slider";

  const name = document.createElement("span");
  name.textContent = `${label}: `;

  const input = document.createElement("input");
  Object.assign(input, {
    type: "range", min, max, value,
  });

  const display = document.createElement("span");
  const update = () => {
    display.textContent = format(+input.value);
    onInput?.(+input.value);
  };
  input.addEventListener("input", update);
  update();

  element.append(name, input, display);
  return { element, inputElement: input, get value() { return +input.value; } };
}
