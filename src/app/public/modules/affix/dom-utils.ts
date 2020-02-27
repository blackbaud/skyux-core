export function isChildVisibleWithinParent(
  child: HTMLElement,
  parent: HTMLElement,
  { top, left }: { top: number, left: number }
): boolean {

  const childRect = child.getBoundingClientRect();
  if (parent === document.body) {
    return !(
      top < 0 ||
      left + childRect.width > document.documentElement.clientWidth ||
      top + childRect.height > document.documentElement.clientHeight ||
      left < 0
    );
  }

  const parentRect = parent.getBoundingClientRect();
  return !(
    parentRect.top > top ||
    parentRect.right < childRect.width + left ||
    parentRect.bottom < top + childRect.height ||
    parentRect.left > left
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

export function getImmediateScrollableParent(scrollableParents: HTMLElement[]): HTMLElement {
  return scrollableParents[scrollableParents.length - 1];
}
