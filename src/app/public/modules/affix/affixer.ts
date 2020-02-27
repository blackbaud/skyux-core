import {
  Renderer2
} from '@angular/core';

import {
  SkyAffixConfig
} from './affix-config';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  getScrollableParentElements
} from './dom-utils';

interface SkyAffixAdapterCoords {
  top: number;
  left: number;
}

const defaultAffixConfig: SkyAffixConfig = {
  enableAutoFit: true,
  placement: 'above',
  isSticky: false
};

function getNextPlacement(placement: SkyAffixPlacement): SkyAffixPlacement {
  const placements: SkyAffixPlacement[] = [
    'above',
    'right',
    'below',
    'left'
  ];

  let index = placements.indexOf(placement) + 1;
  if (index >= placements.length) {
    index = 0;
  }

  return placements[index];
}

function getInversePlacement(placement: SkyAffixPlacement): SkyAffixPlacement {
  const pairings: {[_: string]: SkyAffixPlacement} = {
    above: 'below',
    below: 'above',
    right: 'left',
    left: 'right'
  };

  return pairings[placement];
}

export class SkyAffixer {

  private config: SkyAffixConfig;

  private scrollableParents: HTMLElement[];

  private scrollListeners: Function[];

  private target: HTMLElement;

  constructor(
    private subject: HTMLElement,
    private renderer: Renderer2
  ) { }

  public affixTo(target: HTMLElement, config: SkyAffixConfig): void {
    this.reset();

    this.config = this.prepareConfig(config);
    this.target = target;

    if (this.config.enableAutoFit || this.config.isSticky) {
      this.scrollableParents = getScrollableParentElements(target);
    }

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

    let coords: SkyAffixAdapterCoords;
    if (this.config.enableAutoFit) {
      coords = this.ensureFit(subjectRect, targetRect);
    } else {
      coords = this.getPlacementCoords(subjectRect, targetRect);
    }

    this.renderer.setStyle(this.subject, 'top', `${coords.top}px`);
    this.renderer.setStyle(this.subject, 'left', `${coords.left}px`);
  }

  private getPlacementCoords(
    subjectRect: ClientRect,
    targetRect: ClientRect
  ): SkyAffixAdapterCoords {

    let top: number;
    let left: number;

    const config = this.config;
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

  private ensureFit(
    subjectRect: ClientRect,
    targetRect: ClientRect
  ): SkyAffixAdapterCoords {

    const maxAttempts = 4;
    const scrollableParent = this.scrollableParents[this.scrollableParents.length - 1];
    const parentRect = scrollableParent.getBoundingClientRect();

    let attempts = 0;
    let coords: SkyAffixAdapterCoords;
    let isSubjectFullyVisible = false;
    let placement: SkyAffixPlacement = this.config.placement;

    if (this.isSubjectLargerThanParent(subjectRect, parentRect)) {
      console.warn('The subject element is larger than the parent element. A suitable placement cannot be found!');
      return {
        top: 0,
        left: 0
      };
    }

    do {
      coords = this.getPlacementCoords(subjectRect, targetRect);
      isSubjectFullyVisible = this.confirmSubjectVisibility(subjectRect, parentRect, coords);

      if (!isSubjectFullyVisible) {
        placement = (attempts % 2 === 0)
          ? getInversePlacement(placement)
          : getNextPlacement(placement);

        // Set a new placement and try to find coords that fit.
        this.config.placement = placement;
      }

      attempts++;
    } while (!isSubjectFullyVisible && attempts < maxAttempts);

    if (attempts === maxAttempts) {
      console.warn('Suitable placement not found!');
    }

    return coords;
  }

  private confirmSubjectVisibility(
    subjectRect: ClientRect,
    parentRect: ClientRect,
    { top, left }: SkyAffixAdapterCoords
  ): boolean {
    return !(
      parentRect.top > top ||
      parentRect.right < subjectRect.width + left ||
      parentRect.bottom < top + subjectRect.height ||
      parentRect.left > left
    );
  }

  private isSubjectLargerThanParent(subjectRect: ClientRect, parentRect: ClientRect): boolean {
    return (
      subjectRect.height >= parentRect.height ||
      subjectRect.width >= parentRect.width
    );
  }

  private addScrollListeners(target: HTMLElement, config: SkyAffixConfig): void {
    if (this.scrollListeners) {
      return;
    }

    this.scrollListeners = this.scrollableParents.map((parentElement) => {
      const scrollable = (parentElement === document.body) ? 'window' : parentElement;
      return this.renderer.listen(scrollable, 'scroll', () => this.affix());
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

  private prepareConfig(config: SkyAffixConfig): SkyAffixConfig {
    const merged = {...defaultAffixConfig, ...config};

    if (merged.placement === undefined) {
      merged.placement = defaultAffixConfig.placement;
    }

    if (merged.enableAutoFit === undefined) {
      merged.enableAutoFit = defaultAffixConfig.enableAutoFit;
    }

    if (merged.isSticky === undefined) {
      merged.isSticky = defaultAffixConfig.isSticky;
    }

    return merged;
  }

  private reset(): void {
    this.removeScrollListeners();

    this.config =
      this.target =
      this.scrollableParents =
      this.scrollListeners = undefined;
  }

}
