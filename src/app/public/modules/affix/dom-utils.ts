import {
  SkyAffixOffset
} from './affix-offset';

/**
 * Confirms offset is fully visible within a parent element.
 * @param parent
 * @param offset
 */
export function isOffsetVisibleWithinParent(
  parent: HTMLElement,
  offset: SkyAffixOffset
): boolean {
  const parentOffset = getElementOffset(parent);
  return !(
    parentOffset.top > offset.top ||
    parentOffset.right < offset.right ||
    parentOffset.bottom < offset.bottom ||
    parentOffset.left > offset.left
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

export function getElementOffset(element: HTMLElement): SkyAffixOffset {
  let top: number;
  let left: number;
  let right: number;
  let bottom: number;

  if (element === document.body) {
    left = 0;
    top = 0;
    right = document.documentElement.clientWidth;
    bottom = document.documentElement.clientHeight;
  } else {
    const clientRect = element.getBoundingClientRect();
    left = clientRect.left;
    top = clientRect.top;
    right = clientRect.right;
    bottom = clientRect.bottom;
  }

  return {
    bottom,
    left,
    right,
    top
  };
}
