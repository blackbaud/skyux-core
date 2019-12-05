import {
  ElementRef
} from '@angular/core';

export function getWindow(): Window {
  return window;
}

// export function getParentScrollListeners(
//   elementRef: ElementRef,
//   renderer: Renderer2,
//   callback: () => void
// ): Function[] {
//   const bodyElement = getWindow().document.body;
//   const parentElements = getScrollableParentElements(elementRef);
//   return parentElements.map((parentElement: HTMLElement) => {
//     const scrollable = (parentElement === bodyElement) ? 'window' : parentElement;
//     return renderer.listen(scrollable, 'scroll', () => callback());
//   });
// }

export function getScrollableParentElements(elementRef: ElementRef): HTMLElement[] {
  const windowObj = getWindow();
  const bodyElement = windowObj.document.body;
  const result = [bodyElement];

  let parentElement = elementRef.nativeElement.parentNode;

  while (
    parentElement !== undefined &&
    parentElement !== bodyElement &&
    parentElement instanceof HTMLElement
  ) {
    const overflowY = windowObj.getComputedStyle(parentElement, undefined).overflowY.toLowerCase();
    if (overflowY === 'auto' || overflowY === 'hidden' || overflowY === 'scroll') {
      result.push(parentElement);
    }

    parentElement = parentElement.parentNode;
  }

  return result;
}
