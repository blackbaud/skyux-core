import {
  Renderer2
} from '@angular/core';

import {
  Observable,
  Subscription,
  Subject
} from 'rxjs';

import 'rxjs/add/observable/fromEvent';

import {
  SkyAffixAdapterCoords
} from './affix-adapter-coords';

import {
  SkyAffixConfig
} from './affix-config';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  SkyAffixSubjectVisibilityChange
} from './affix-subject-visibility-change';

import {
  getInversePlacement,
  getNextPlacement
} from './affix-utils';

import {
  getImmediateScrollableParent,
  getParentCoords,
  getScrollableParents,
  isChildVisibleWithinParent
} from './dom-utils';

const DEFAULT_AFFIX_CONFIG: SkyAffixConfig = {
  enableAutoFit: true,
  placement: 'above',
  isSticky: false
};

export class SkyAffixer {

  public get subjectVisibilityChange(): Observable<SkyAffixSubjectVisibilityChange> {
    return this._subjectVisibilityChange.asObservable();
  }

  private _subjectVisibilityChange = new Subject<SkyAffixSubjectVisibilityChange>();

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

  private isSubjectVisible: boolean = false;

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
    this._subjectVisibilityChange.complete();
    this._subjectVisibilityChange = undefined;
  }

  private affix(): void {
    this.targetRect = this.target.getBoundingClientRect();
    this.subjectRect = this.subject.getBoundingClientRect();

    const { top, left } = this.getCoords();

    this.renderer.setStyle(this.subject, 'top', `${top}px`);
    this.renderer.setStyle(this.subject, 'left', `${left}px`);
  }

  private getCoords(): SkyAffixAdapterCoords {
    const parent = getImmediateScrollableParent(this.scrollableParents);

    const maxAttempts = 4;
    let attempts = 0;

    let isSubjectVisible = false;
    let coords: SkyAffixAdapterCoords;
    let placement = this.config.placement;

    do {
      coords = this.getPreferredCoords(placement);
      isSubjectVisible = isChildVisibleWithinParent(this.subject, parent, coords);

      if (!this.config.enableAutoFit) {
        break;
      }

      if (!isSubjectVisible) {
        placement = (attempts % 2 === 0)
          ? getInversePlacement(placement)
          : getNextPlacement(placement);
      }

      attempts++;
    } while (!isSubjectVisible && attempts < maxAttempts);

    this.emitSubjectVisibilityChange(isSubjectVisible);

    return coords;
  }

  private getPreferredCoords(placement: SkyAffixPlacement): SkyAffixAdapterCoords {
    const subjectRect = this.subjectRect;
    const targetRect = this.targetRect;

    const parent = getImmediateScrollableParent(this.scrollableParents);
    const parentCoords = getParentCoords(parent);

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
        if (left < parentCoords.left) {
          left = parentCoords.left;
        } else if (left + subjectRect.width > parentCoords.right) {
          left = parentCoords.right - subjectRect.width;
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
        if (top < parentCoords.top) {
          top = parentCoords.top;
        } else if (top + subjectRect.height > parentCoords.bottom) {
          top = parentCoords.bottom - subjectRect.height;
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

  private emitSubjectVisibilityChange(isVisible: boolean): void {
    if (this.isSubjectVisible !== isVisible) {
      this.isSubjectVisible = isVisible;
      this._subjectVisibilityChange.next({
        isVisible: isVisible
      });
    }
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
