import {
  Renderer2
} from '@angular/core';

import {
  SkyAffixConfig
} from './affix-config';

interface SkyAffixCoords {
  top: number;
  left: number;
}

const defaultAffixConfig: SkyAffixConfig = {
  placement: 'above'
};

export class SkyAffixer {

  constructor(
    private subject: HTMLElement,
    private renderer: Renderer2
  ) { }

  public affixTo(target: HTMLElement, config: SkyAffixConfig): void {
    const settings = {...defaultAffixConfig, ...config};

    const targetRect = target.getBoundingClientRect();
    const subjectRect = this.subject.getBoundingClientRect();

    const { top, left } = this.getPlacementCoords(subjectRect, targetRect, settings);

    this.renderer.setStyle(this.subject, 'top', `${top}px`);
    this.renderer.setStyle(this.subject, 'left', `${left}px`);
  }

  private getPlacementCoords(
    subjectRect: ClientRect,
    targetRect: ClientRect,
    config: SkyAffixConfig
  ): SkyAffixCoords {

    let top: number;
    let left: number;

    const placement = config.placement;

    if (placement === 'above' || placement === 'below') {
      if (placement === 'above') {
        top = targetRect.top - subjectRect.height;
      } else {
        top = targetRect.bottom;
      }

      switch (config.horizontalAlignment) {
        case 'left':
          left = targetRect.left;
          break;

        case 'center':
          default:
            left = targetRect.left + (targetRect.width / 2) - (subjectRect.width / 2);
            break;

        case 'right':
          left = targetRect.right - subjectRect.width;
          break;
      }

    } else {
      if (placement === 'left') {
        left = targetRect.left - subjectRect.width;
      } else {
        left = targetRect.right;
      }

      switch (config.verticalAlignment) {
        case 'top':
          top = targetRect.top;
          break;

        case 'middle':
        default:
          top = targetRect.top + (targetRect.height / 2) - (subjectRect.height / 2);
          break;

        case 'bottom':
          top = targetRect.bottom - subjectRect.height;
          break;
      }
    }

    return {
      top,
      left
    };
  }

}
