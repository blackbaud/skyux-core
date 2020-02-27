export function isChildVisibleWithinParent(
  childRect: ClientRect,
  parentRect: ClientRect,
  { top, left }: { top: number, left: number }
): boolean {
  return !(
    parentRect.top > top ||
    parentRect.right < childRect.width + left ||
    parentRect.bottom < top + childRect.height ||
    parentRect.left > left
  );
}

export function isLargerThan(firstRect: ClientRect, secondRect: ClientRect): boolean {
  return (
    firstRect.height >= secondRect.height ||
    firstRect.width >= secondRect.width
  );
}

export function getScrollableParents(subject: HTMLElement): HTMLElement[] {
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

export function getImmediateScrollableParent(scrollableParents: HTMLElement[]): ClientRect {
  const scrollableParent = scrollableParents[scrollableParents.length - 1];
  return scrollableParent.getBoundingClientRect();
}
