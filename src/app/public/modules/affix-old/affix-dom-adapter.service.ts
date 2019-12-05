import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyAppWindowRef
} from '../window/window-ref';

import {
  SkyAffixHorizontalAlignment
} from './affix-horizontal-alignment';
import { SkyAffixPlacement } from './affix-placement';
import { SkyAffixPosition } from './affix-position';

export interface SkyAffixDomAdapterElements {
  subject: ElementRef;
  target: ElementRef;
}

export interface SkyAffixDomAdapterCoordinates {
  top: number;
  left: number;
  isOutsideViewport: boolean;
}

/**
 * @internal
 */
@Injectable()
export class SkyAffixDomAdapterService {

  private renderer: Renderer2;

  constructor(
    private windowRef: SkyAppWindowRef,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public getPosition(
    elements: SkyAffixDomAdapterElements,
    placement: SkyAffixPlacement,
    alignment: SkyAffixHorizontalAlignment
  ): SkyAffixPosition {
    const max = 4;

    let counter = 0;
    let coords: SkyAffixDomAdapterCoordinates;

    do {
      coords = this.getCoordinates(elements, placement, alignment);

      if (coords.isOutsideViewport) {
        placement = (counter % 2 === 0) ?
          this.getInversePlacement(placement) :
          this.getNextPlacement(placement);
      }

      counter++;
    } while (coords.isOutsideViewport && counter < max);

    if (counter === max && coords.isOutsideViewport) {
      // placement = 'fullscreen';
      console.log('NO PLACEMENT AVAILABILE!');
    }

    const position = this.verifyCoordinatesNearCaller(elements, {
      top: coords.top,
      left: coords.left,
      placement,
      alignment
    });

    return position;
  }

  // public hidePopover(elem: ElementRef): void {
  //   this.renderer.addClass(elem.nativeElement, 'sky-popover-hidden');
  // }

  // public showPopover(elem: ElementRef): void {
  //   this.renderer.removeClass(elem.nativeElement, 'sky-popover-hidden');
  // }

  public isSubjectLargerThanParent(popover: ElementRef): boolean {
    const windowObj = this.windowRef.nativeWindow;
    const subjectRect = popover.nativeElement.getBoundingClientRect();

    return (
      subjectRect.height >= windowObj.innerHeight ||
      subjectRect.width >= windowObj.innerWidth
    );
  }

  public getParentScrollListeners(
    popover: ElementRef,
    callback: (isVisibleWithinScrollable: boolean) => void
  ): Function[] {
    const bodyElement = this.windowRef.nativeWindow.document.body;
    const parentElements = this.getScrollableParentElements(popover);

    const listeners = parentElements.map((parentElement: HTMLElement) => {
      const target: any = (parentElement === bodyElement) ? 'window' : parentElement;

      return this.renderer.listen(target, 'scroll', () => {
        const isVisible = (target === 'window')
          ? true
          : this.isVisibleWithinScrollable(target, popover.nativeElement);

        callback(isVisible);
      });
    });

    return listeners;
  }

  private getCoordinates(
    elements: SkyAffixDomAdapterElements,
    placement: SkyAffixPlacement,
    alignment: SkyAffixHorizontalAlignment
  ): SkyAffixDomAdapterCoordinates {
    const windowObj = this.windowRef.nativeWindow;
    const subjectRect = elements.subject.nativeElement.getBoundingClientRect();
    const targetRect = elements.target.nativeElement.getBoundingClientRect();

    const targetXCenter = targetRect.width / 2;
    const scrollRight = windowObj.innerWidth;
    const scrollBottom = windowObj.innerHeight;

    let top: number;
    let left: number;
    let bleedLeft = 0;
    let bleedRight = 0;
    let bleedTop = 0;
    let bleedBottom = 0;
    let isOutsideViewport = false;

    /* tslint:disable-next-line:switch-default */
    switch (placement) {
      case 'above':
      top = targetRect.top - subjectRect.height;
      bleedTop = top;
      break;

      case 'below':
      top = targetRect.bottom;
      bleedBottom = scrollBottom - (top + subjectRect.height);
      break;

      case 'right':
      left = targetRect.right;
      bleedRight = scrollRight - (left + subjectRect.width);
      break;

      case 'left':
      left = targetRect.left - subjectRect.width;
      bleedLeft = left;
      break;
    }

    if (placement === 'right' || placement === 'left') {
      top = targetRect.top - (subjectRect.height / 2) + (targetRect.height / 2);
      bleedTop = top;
      bleedBottom = scrollBottom - (top + subjectRect.height);
    }

    if (placement === 'above' || placement === 'below') {

      // Make adjustments based on horizontal alignment.
      switch (alignment) {
        default:
        case 'center':
        left = targetRect.left - (subjectRect.width / 2) + targetXCenter;
        break;

        case 'left':
        left = targetRect.left;
        break;

        case 'right':
        left = targetRect.left - subjectRect.width + targetRect.width;
        break;
      }

      bleedLeft = left;
      bleedRight = scrollRight - (left + subjectRect.width);
    }

    // Clipped on left?
    if (bleedLeft < 0) {
      if (placement === 'left') {
        isOutsideViewport = true;
      }

      left = 0;
    }

    // Clipped on right?
    if (bleedRight < 0) {
      if (placement === 'right') {
        isOutsideViewport = true;
      }

      left += bleedRight;
    }

    // Clipped on top?
    if (bleedTop < 0) {
      if (placement === 'above') {
        isOutsideViewport = true;
      }

      top -= bleedTop;
    }

    // Clipped on bottom?
    if (bleedBottom < 0) {
      if (placement === 'below') {
        isOutsideViewport = true;
      }

      top += bleedBottom;
    }

    return {
      top,
      left,
      isOutsideViewport
    };
  }

  // This method ensures that the popover remains close to caller element,
  // when the caller element is no longer visible after scrolling.
  private verifyCoordinatesNearCaller(
    elements: SkyAffixDomAdapterElements,
    position: SkyAffixPosition
  ): SkyAffixPosition {
    const windowObj = this.windowRef.nativeWindow;
    const targetRect = elements.target.nativeElement.getBoundingClientRect();
    const subjectRect = elements.subject.nativeElement.getBoundingClientRect();
    const pixelTolerance = 40;

    if (position.placement === 'left' || position.placement === 'right') {
      if (targetRect.top < 0) {
        position.top = targetRect.top;
      }

      if (targetRect.bottom > windowObj.innerHeight) {
        position.top = targetRect.bottom - subjectRect.height;
      }
    }

    if (position.placement === 'above' || position.placement === 'below') {
      if (position.left + pixelTolerance > targetRect.right) {
        position.left = targetRect.right - pixelTolerance;
      }

      if (position.left + subjectRect.width - pixelTolerance < targetRect.left) {
        position.left = targetRect.left - subjectRect.width + pixelTolerance;
      }
    }

    return position;
  }

  private getNextPlacement(placement: SkyAffixPlacement): SkyAffixPlacement {
    const placements: SkyAffixPlacement[] = ['above', 'right', 'below', 'left'];

    let index = placements.indexOf(placement) + 1;
    if (index === placements.length) {
      index = 0;
    }

    return placements[index];
  }

  private getInversePlacement(placement: SkyAffixPlacement): SkyAffixPlacement {
    const pairings: any = {
      above: 'below',
      below: 'above',
      right: 'left',
      left: 'right'
    };

    return pairings[placement];
  }

  private getScrollableParentElements(element: ElementRef): Array<HTMLElement> {
    const windowObj = this.windowRef.nativeWindow;
    const bodyElement = windowObj.document.body;
    const result = [bodyElement];

    let parentElement = element.nativeElement.parentNode;

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

  // Returns true if the popover is visible in the scrollable parent.
  private isVisibleWithinScrollable(container: any, popover: any): boolean {
    const containerRect = container.getBoundingClientRect();
    const subjectRect = popover.getBoundingClientRect();
    const percentageTopVisible = (subjectRect.top === 0) ? 100 : subjectRect.top / containerRect.top * 100;
    const percentageBottomVisible = (containerRect.bottom === 0) ? 100 : containerRect.bottom / subjectRect.bottom * 100;

    return (percentageTopVisible > 95 && percentageBottomVisible > 95);
  }
}
