export function getScrollableParentElements(subject: HTMLElement): HTMLElement[] {
  const bodyElement = window.document.body;
  const result = [bodyElement];

  let parentElement = subject.parentNode;

  while (
    parentElement !== undefined &&
    parentElement !== bodyElement &&
    parentElement instanceof HTMLElement
  ) {
    const overflowY = window.getComputedStyle(parentElement, undefined).overflowY.toLowerCase();
    if (
      overflowY === 'auto' ||
      overflowY === 'hidden' ||
      overflowY === 'scroll'
    ) {
      result.push(parentElement);
    }

    parentElement = parentElement.parentNode;
  }

  return result;
}
