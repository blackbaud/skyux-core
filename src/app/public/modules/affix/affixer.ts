import {
  Renderer2
} from '@angular/core';

import {
  Observable,
  Subject,
  Subscription
} from 'rxjs';

import 'rxjs/add/observable/fromEvent';

import {
  SkyAffixOffset
} from './affix-offset';

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
  getElementOffset,
  getScrollableParents,
  isOffsetVisibleWithinParent
} from './dom-utils';

const DEFAULT_AFFIX_CONFIG: SkyAffixConfig = {
  enableAutoFit: false,
  horizontalAlignment: 'center',
  isSticky: false,
  placement: 'above',
  verticalAlignment: 'middle'
};

export class SkyAffixer {

  public get subjectVisibilityChange(): Observable<SkyAffixSubjectVisibilityChange> {
    return this._subjectVisibilityChange.asObservable();
  }

  private _subjectVisibilityChange = new Subject<SkyAffixSubjectVisibilityChange>();

  private get config(): SkyAffixConfig {
    return this._config;
  }

  private set config(value: SkyAffixConfig) {
    const merged = {...DEFAULT_AFFIX_CONFIG, ...value};

    // Make sure none of the values are undefined.
    Object.keys(merged).forEach((k: keyof SkyAffixConfig) => {
      if (merged[k] === undefined) {
        (merged as any)[k] = DEFAULT_AFFIX_CONFIG[k];
      }
    });

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

  /**
   * Affixes a subject element to a target element.
   * @param target The target element.
   * @param config Configuration for the affix action.
   */
  public affixTo(target: HTMLElement, config?: SkyAffixConfig): void {

    this.reset();

    this.config = config;
    this.target = target;
    this.scrollableParents = getScrollableParents(target);

    this.affix();

    if (this.config.isSticky) {
      this.addScrollListeners();
      this.addResizeListener();
    }
  }

  /**
   * Destroys the affixer.
   */
  public destroy(): void {
    this.reset();
    this._subjectVisibilityChange.complete();
    this._subjectVisibilityChange = undefined;
  }

  private affix(): void {
    this.targetRect = this.target.getBoundingClientRect();
    this.subjectRect = this.subject.getBoundingClientRect();

    const { top, left } = this.getOffset();

    this.renderer.setStyle(this.subject, 'top', `${top}px`);
    this.renderer.setStyle(this.subject, 'left', `${left}px`);
  }

  private getOffset(): SkyAffixOffset {
    const parent = getImmediateScrollableParent(this.scrollableParents);

    const maxAttempts = 4;
    let attempts = 0;

    let isSubjectVisible = false;
    let offset: SkyAffixOffset;
    let placement = this.config.placement;

    do {
      offset = this.getPreferredOffset(placement);
      isSubjectVisible = isOffsetVisibleWithinParent(parent, offset);

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

    // No suitable placement was found, so revert to preferred placement.
    if (attempts >= maxAttempts && !isSubjectVisible) {
      offset = this.getPreferredOffset(this.config.placement);
    }

    this.emitSubjectVisibilityChange(isSubjectVisible);

    return offset;
  }

  private getPreferredOffset(placement: SkyAffixPlacement): SkyAffixOffset {
    const subjectRect = this.subjectRect;
    const targetRect = this.targetRect;

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
    }

    let offset: SkyAffixOffset = { left, top };
    if (enableAutoFit) {
      offset = this.adjustOffsetToScrollableParent({...offset}, placement);
    }

    offset.bottom = offset.top + subjectRect.height;
    offset.right = offset.left + subjectRect.width;

    return offset;
  }

  /**
   * Slightly adjust the offset to fit within the scroll parent's boundaries if
   * the subject element would otherwise be clipped.
   */
  private adjustOffsetToScrollableParent(
    offset: SkyAffixOffset,
    placement: SkyAffixPlacement
  ): SkyAffixOffset {
    const parent = getImmediateScrollableParent(this.scrollableParents);
    const parentOffset = getElementOffset(parent);

    const subjectRect = this.subjectRect;
    const targetRect = this.targetRect;

    /* tslint:disable-next-line:switch-default */
    switch (placement) {
      case 'above':
      case 'below':
        if (offset.left < parentOffset.left) {
          offset.left = parentOffset.left;
        } else if (offset.left + subjectRect.width > parentOffset.right) {
          offset.left = parentOffset.right - subjectRect.width;
        }

        // Make sure the subject never detaches from the target.
        if (offset.left > targetRect.left) {
          offset.left = targetRect.left;
        } else if (offset.left + subjectRect.width < targetRect.right) {
          offset.left = targetRect.right - subjectRect.width;
        }
        break;

      case 'left':
      case 'right':
        if (offset.top < parentOffset.top) {
          offset.top = parentOffset.top;
        } else if (offset.top + subjectRect.height > parentOffset.bottom) {
          offset.top = parentOffset.bottom - subjectRect.height;
        }

        // Make sure the subject never detaches from the target.
        if (offset.top > targetRect.top) {
          offset.top = targetRect.top;
        } else if (offset.top + subjectRect.height < targetRect.bottom) {
          offset.top = targetRect.bottom - subjectRect.height;
        }
        break;
    }

    return offset;
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
    this.scrollListeners = this.scrollableParents.map((parentElement) => {
      const scrollable = (parentElement === document.body) ? 'window' : parentElement;
      return this.renderer.listen(scrollable, 'scroll', () => this.affix());
    });
  }

  private addResizeListener(): void {
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
