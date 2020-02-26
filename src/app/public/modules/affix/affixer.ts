import {
  Renderer2
} from '@angular/core';

import {
  SkyAffixConfig
} from './affix-config';

import {
  getScrollableParentElements
} from './dom-utils';

interface SkyAffixCoords {
  top: number;
  left: number;
}

const defaultAffixConfig: SkyAffixConfig = {
  placement: 'above',
  isSticky: false
};

export class SkyAffixer {

  private scrollListeners: Function[];

  private config: SkyAffixConfig;

  private target: HTMLElement;

  constructor(
    private subject: HTMLElement,
    private renderer: Renderer2
  ) { }

  public affixTo(target: HTMLElement, config: SkyAffixConfig): void {
    this.reset();

    this.config = {...defaultAffixConfig, ...config};
    this.target = target;

    this.affix();

    if (this.config.isSticky) {
      this.addScrollListeners(target, config);
    }
  }

  public destroy(): void {
    this.reset();
  }

  private affix(): void {
    const targetRect = this.target.getBoundingClientRect();
    const subjectRect = this.subject.getBoundingClientRect();

    const { top, left } = this.getPlacementCoords(subjectRect, targetRect, this.config);

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

  private addScrollListeners(target: HTMLElement, config: SkyAffixConfig): void {
    if (this.scrollListeners) {
      return;
    }

    this.scrollListeners = this.getParentScrollListeners(
      target,
      () => this.affixTo(target, config)
    );
  }

  private getParentScrollListeners(element: HTMLElement, callback: () => void): Function[] {
    return getScrollableParentElements(element)
      .map((parentElement) => {
        const scrollable = (parentElement === document.body) ? 'window' : parentElement;
        return this.renderer.listen(scrollable, 'scroll', () => callback());
      });
  }

  private removeScrollListeners(): void {
    if (this.scrollListeners) {
      // Remove renderer-generated listeners by calling the listener itself.
      // https://github.com/angular/angular/issues/9368#issuecomment-227199778
      this.scrollListeners.forEach(listener => listener());
      this.scrollListeners = undefined;
    }
  }

  private reset(): void {
    this.removeScrollListeners();

    this.config =
      this.target =
      this.scrollListeners = undefined;
  }

}
