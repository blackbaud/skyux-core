import {
  SkyAffixAdapterCoords
} from './affix-adapter-coords';

/**
 * Validates coordinates are fully visible within an element.
 * @param parent
 * @param coords
 */
export function verifyCoordsVisibleWithinElement(
  parent: HTMLElement,
  coords: SkyAffixAdapterCoords
): boolean {
  const parentCoords = getParentCoords(parent);
  return !(
    parentCoords.top > coords.top ||
    parentCoords.right < coords.right ||
    parentCoords.bottom < coords.bottom ||
    parentCoords.left > coords.left
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

export function getParentCoords(parent: HTMLElement): SkyAffixAdapterCoords {
  let top: number;
  let left: number;
  let right: number;
  let bottom: number;

  if (parent === document.body) {
    left = 0;
    top = 0;
    right = document.documentElement.clientWidth;
    bottom = document.documentElement.clientHeight;
  } else {
    const parentRect = parent.getBoundingClientRect();
    left = parentRect.left;
    top = parentRect.top;
    right = parentRect.right;
    bottom = parentRect.bottom;
  }

  return {
    bottom,
    left,
    right,
    top
  };
}
