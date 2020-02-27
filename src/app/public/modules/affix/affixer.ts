import {
  Renderer2
} from '@angular/core';

import {
  Observable,
  Subscription
} from 'rxjs';

import 'rxjs/add/observable/fromEvent';

import {
  SkyAffixConfig
} from './affix-config';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  getImmediateScrollableParent,
  getScrollableParents,
  isChildVisibleWithinParent,
  isLargerThan
} from './dom-utils';

interface SkyAffixAdapterCoords {
  top: number;
  left: number;
}

const DEFAULT_AFFIX_CONFIG: SkyAffixConfig = {
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

  private get config(): SkyAffixConfig {
    return this._config || DEFAULT_AFFIX_CONFIG;
  }

  private set config(value: SkyAffixConfig) {
    const merged = {...DEFAULT_AFFIX_CONFIG, ...value};

    if (merged.placement === undefined) {
      merged.placement = DEFAULT_AFFIX_CONFIG.placement;
    }

    if (merged.enableAutoFit === undefined) {
      merged.enableAutoFit = DEFAULT_AFFIX_CONFIG.enableAutoFit;
    }

    if (merged.isSticky === undefined) {
      merged.isSticky = DEFAULT_AFFIX_CONFIG.isSticky;
    }

    this._config = merged;
  }

  private resizeListener: Subscription;

  private scrollableParents: HTMLElement[];

  private scrollListeners: Function[];

  private subjectRect: ClientRect;

  private target: HTMLElement;

  private targetRect: ClientRect;

  private _config: SkyAffixConfig;

  constructor(
    private subject: HTMLElement,
    private renderer: Renderer2
  ) { }

  public affixTo(target: HTMLElement, config: SkyAffixConfig): void {
    this.reset();

    this.config = config;
    this.target = target;

    if (this.config.enableAutoFit || this.config.isSticky) {
      this.scrollableParents = getScrollableParents(target);
    }

    this.affix();

    if (this.config.isSticky) {
      this.addScrollListeners();
      this.addResizeListener();
    }
  }

  public destroy(): void {
    this.reset();
  }

  private affix(): void {
    this.targetRect = this.target.getBoundingClientRect();
    this.subjectRect = this.subject.getBoundingClientRect();

    const { top, left } = this.config.enableAutoFit
      ? this.getAutoFitCoords()
      : this.getPlacementCoords();

    this.renderer.setStyle(this.subject, 'top', `${top}px`);
    this.renderer.setStyle(this.subject, 'left', `${left}px`);
  }

  private getPlacementCoords(): SkyAffixAdapterCoords {
    const subjectRect = this.subjectRect;
    const targetRect = this.targetRect;
    const parentRect = getImmediateScrollableParent(this.scrollableParents);

    const placement = this.config.placement;
    const horizontalAlignment = this.config.horizontalAlignment;
    const verticalAlignment = this.config.verticalAlignment;
    const enableAutoFit = this.config.enableAutoFit;

    let top: number;
    let left: number;

    if (placement === 'above' || placement === 'below') {
      if (placement === 'above') {
        top = targetRect.top - subjectRect.height;
      } else {
        top = targetRect.bottom;
      }

      switch (horizontalAlignment) {
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

      // Slightly adjust the coords to fit within the parent's boundaries if the target is in view.
      if (enableAutoFit) {
        if (left < parentRect.left) {
          left = parentRect.left;
        } else if (left + subjectRect.width > parentRect.right) {
          left = parentRect.right - subjectRect.width;
        }
        // Make sure the subject never detaches from the target.
        if (left > targetRect.left) {
          left = targetRect.left;
        } else if (left + subjectRect.width < targetRect.right) {
          left = targetRect.right - subjectRect.width;
        }
      }

    } else {
      if (placement === 'left') {
        left = targetRect.left - subjectRect.width;
      } else {
        left = targetRect.right;
      }

      switch (verticalAlignment) {
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

      // Slightly adjust the coords to fit within the parent's boundaries if the target is in view.
      if (enableAutoFit) {
        if (top < parentRect.top) {
          top = parentRect.top;
        } else if (top + subjectRect.height > parentRect.bottom) {
          top = parentRect.bottom - subjectRect.height;
        }

        // Make sure the subject never detaches from the target.
        if (top > targetRect.top) {
          top = targetRect.top;
        } else if (top + subjectRect.height < targetRect.bottom) {
          top = targetRect.bottom - subjectRect.height;
        }
      }
    }

    return {
      top,
      left
    };
  }

  private getAutoFitCoords(): SkyAffixAdapterCoords {
    const parentRect = getImmediateScrollableParent(this.scrollableParents);
    const subjectRect = this.subjectRect;

    // TODO: Emit an event instead.
    if (isLargerThan(subjectRect, parentRect)) {
      console.warn('The subject element is larger than the parent element. A suitable placement cannot be found!');
      return {
        top: 0,
        left: 0
      };
    }

    const maxAttempts = 4;
    let attempts = 0;

    let isSubjectVisible = false;
    let coords: SkyAffixAdapterCoords;
    let placement = this.config.placement;

    do {
      coords = this.getPlacementCoords();
      isSubjectVisible = isChildVisibleWithinParent(subjectRect, parentRect, coords);

      if (!isSubjectVisible) {
        placement = (attempts % 2 === 0)
          ? getInversePlacement(placement)
          : getNextPlacement(placement);

        // Set a new placement and try to find coords that fit.
        this.config.placement = placement;
      }

      attempts++;
    } while (!isSubjectVisible && attempts < maxAttempts);

    if (attempts === maxAttempts) {
      // TODO: Emit an event.
      console.warn('Suitable placement not found!');
    }

    return coords;
  }

  private addScrollListeners(): void {
    if (this.scrollListeners) {
      return;
    }

    this.scrollListeners = this.scrollableParents.map((parentElement) => {
      const scrollable = (parentElement === document.body) ? 'window' : parentElement;
      return this.renderer.listen(scrollable, 'scroll', () => this.affix());
    });
  }

  private addResizeListener(): void {
    if (this.resizeListener) {
      return;
    }

    this.resizeListener = Observable.fromEvent(window, 'resize')
      .subscribe(() => this.affix());
  }

  private reset(): void {
    this.removeScrollListeners();
    this.removeResizeListener();

    this._config =
      this.target =
      this.targetRect =
      this.subjectRect =
      this.scrollableParents = undefined;
  }

  private removeResizeListener(): void {
    if (this.resizeListener) {
      this.resizeListener.unsubscribe();
      this.resizeListener = undefined;
    }
  }

  private removeScrollListeners(): void {
    if (this.scrollListeners) {
      // Remove renderer-generated listeners by calling the listener itself.
      // https://github.com/angular/angular/issues/9368#issuecomment-227199778
      this.scrollListeners.forEach(listener => listener());
      this.scrollListeners = undefined;
    }
  }

}
