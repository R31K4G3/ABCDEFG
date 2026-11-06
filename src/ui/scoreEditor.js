/**
 * @param {string} initialText
 * @returns {{ element: HTMLDivElement, getText(): string, setText(text: string) }}
 */
export function createScoreEditor(initialText) {
  const element = document.createElement("div");
  element.className = "track";

  const textarea = document.createElement("textarea");
  textarea.value = initialText;
  element.appendChild(textarea);

  return {
    element,
    getText: () => textarea.value,
    setText: text => { textarea.value = text; },
  };
}
