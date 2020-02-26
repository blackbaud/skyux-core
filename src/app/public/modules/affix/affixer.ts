import {
  Renderer2
} from '@angular/core';

import {
  SkyAffixConfig
} from './affix-config';

import {
  SkyAffixPlacement
} from './affix-placement';

interface SkyAffixCoords {
  top: number;
  left: number;
}

export class SkyAffixer {

  constructor(
    private subject: HTMLElement,
    private renderer: Renderer2
  ) { }

  public affixTo(target: HTMLElement, config: SkyAffixConfig): void {
    const targetRect = target.getBoundingClientRect();
    const subjectRect = this.subject.getBoundingClientRect();

    const { top, left } = this.getPlacementCoords(config.placement, subjectRect, targetRect);

    this.renderer.setStyle(this.subject, 'top', `${top}px`);
    this.renderer.setStyle(this.subject, 'left', `${left}px`);
  }

  private getPlacementCoords(
    placement: SkyAffixPlacement,
    subjectRect: ClientRect,
    targetRect: ClientRect
  ): SkyAffixCoords {

    let top: number;
    let left: number;

    switch (placement) {
      case 'above':
        top = targetRect.top - subjectRect.height;
        left = targetRect.left + (targetRect.width / 2) - (subjectRect.width / 2);
        break;

      case 'below':
      default:
        top = targetRect.bottom;
        left = targetRect.left + (targetRect.width / 2) - (subjectRect.width / 2);
        break;

      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (subjectRect.height / 2);
        left = targetRect.left - subjectRect.width;
        break;

      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (subjectRect.height / 2);
        left = targetRect.right;
        break;
    }

    return {
      top,
      left
    };
  }

}
