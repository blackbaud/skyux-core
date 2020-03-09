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
  MutationObserverService
} from '../mutation';

import {
  SkyAffixAutoFitContext
} from './affix-auto-fit-context';

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
  SkyAffixPlacementChange
} from './affix-placement-change';

import {
  getInversePlacement,
  getNextPlacement
} from './affix-utils';

import {
  getElementOffset,
  getOverflowParents,
  isOffsetVisibleWithinParent
} from './dom-utils';

const DEFAULT_AFFIX_CONFIG: SkyAffixConfig = {
  autoFitContext: SkyAffixAutoFitContext.OverflowParent,
  enableAutoFit: false,
  horizontalAlignment: 'center',
  isSticky: false,
  placement: 'above',
  verticalAlignment: 'middle'
};

export class SkyAffixer {

  /**
   * Fires when the base element's nearest overflow parent is scrolling. This is useful if you need
   * to perform an additional action during the scroll event but don't want to generate another
   * event listener.
   */
  public get overflowScroll(): Observable<void> {
    return this._overflowScroll.asObservable();
  }

  /**
   * Fires when the placement value changes. A `null` value indicates that a suitable
   * placement could not be found.
   */
  public get placementChange(): Observable<SkyAffixPlacementChange> {
    return this._placementChange.asObservable();
  }

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

  private affixedRect: ClientRect;

  private baseElement: HTMLElement;

  private baseRect: ClientRect;

  private currentOffset: SkyAffixOffset;

  private currentPlacement: SkyAffixPlacement;

  private observer: MutationObserver;

  private overflowParents: HTMLElement[];

  private resizeListener: Subscription;

  private scrollListeners: Function[];

  private _config: SkyAffixConfig;

  private _overflowScroll = new Subject<void>();

  private _placementChange = new Subject<SkyAffixPlacementChange>();

  constructor(
    private affixedElement: HTMLElement,
    private renderer: Renderer2,
    private observerService: MutationObserverService
  ) { }

  /**
   * Affixes an element to a base element.
   * @param baseElement The base element.
   * @param config Configuration for the affix action.
   */
  public affixTo(baseElement: HTMLElement, config?: SkyAffixConfig): void {

    this.reset();

    this.config = config;
    this.baseElement = baseElement;
    this.overflowParents = getOverflowParents(baseElement);

    this.affix();

    if (this.config.isSticky) {
      this.addScrollListeners();
      this.addResizeListener();
      this.addMutationObserver();
    }
  }

  /**
   * Re-runs the affix calculation.
   */
  public reaffix(): void {
    // Reset current placement to preferred placement.
    this.currentPlacement = this.config.placement;
    this.affix();
  }

  /**
   * Destroys the affixer.
   */
  public destroy(): void {
    this.reset();
    this._placementChange.complete();

    this._placementChange =
      this._overflowScroll = undefined;
  }

  private affix(): void {
    this.baseRect = this.baseElement.getBoundingClientRect();
    this.affixedRect = this.affixedElement.getBoundingClientRect();

    const offset = this.getOffset();

    if (this.isNewOffset(offset)) {
      this.renderer.setStyle(this.affixedElement, 'top', `${offset.top}px`);
      this.renderer.setStyle(this.affixedElement, 'left', `${offset.left}px`);
    }
  }

  private getOffset(): SkyAffixOffset {
    const parent = this.getImmediateOverflowParent();

    const maxAttempts = 4;
    let attempts = 0;

    let isAffixedElementFullyVisible = false;
    let offset: SkyAffixOffset;
    let placement = this.config.placement;

    do {
      offset = this.getPreferredOffset(placement);
      isAffixedElementFullyVisible = isOffsetVisibleWithinParent(
        parent,
        offset,
        this.config.autoFitOverflowOffset
      );

      if (!this.config.enableAutoFit) {
        break;
      }

      if (!isAffixedElementFullyVisible) {
        placement = (attempts % 2 === 0)
          ? getInversePlacement(placement)
          : getNextPlacement(placement);
      }

      attempts++;
    } while (!isAffixedElementFullyVisible && attempts < maxAttempts);

    if (isAffixedElementFullyVisible) {
      this.emitPlacementChange(placement);
      return offset;
    }

    if (this.config.enableAutoFit) {
      /* tslint:disable-next-line:no-null-keyword */
      this.emitPlacementChange(null);
    }

    // No suitable placement was found, so revert to preferred placement.
    return this.getPreferredOffset(this.config.placement);
  }

  private getPreferredOffset(placement: SkyAffixPlacement): SkyAffixOffset {
    const affixedRect = this.affixedRect;
    const baseRect = this.baseRect;

    const horizontalAlignment = this.config.horizontalAlignment;
    const verticalAlignment = this.config.verticalAlignment;
    const enableAutoFit = this.config.enableAutoFit;

    let top: number;
    let left: number;

    if (placement === 'above' || placement === 'below') {
      if (placement === 'above') {
        top = baseRect.top - affixedRect.height;
      } else {
        top = baseRect.bottom;
      }

      switch (horizontalAlignment) {
        case 'left':
          left = baseRect.left;
          break;

        case 'center':
          default:
            left = baseRect.left + (baseRect.width / 2) - (affixedRect.width / 2);
            break;

        case 'right':
          left = baseRect.right - affixedRect.width;
          break;
      }
    } else {
      if (placement === 'left') {
        left = baseRect.left - affixedRect.width;
      } else {
        left = baseRect.right;
      }

      switch (verticalAlignment) {
        case 'top':
          top = baseRect.top;
          break;

        case 'middle':
        default:
          top = baseRect.top + (baseRect.height / 2) - (affixedRect.height / 2);
          break;

        case 'bottom':
          top = baseRect.bottom - affixedRect.height;
          break;
      }
    }

    let offset: SkyAffixOffset = { left, top };
    if (enableAutoFit) {
      offset = this.adjustOffsetToOverflowParent({...offset}, placement);
    }

    offset.bottom = offset.top + affixedRect.height;
    offset.right = offset.left + affixedRect.width;

    return offset;
  }

  /**
   * Slightly adjust the offset to fit within the scroll parent's boundaries if
   * the affixed element would otherwise be clipped.
   */
  private adjustOffsetToOverflowParent(
    offset: SkyAffixOffset,
    placement: SkyAffixPlacement
  ): SkyAffixOffset {
    const parent = this.getImmediateOverflowParent();
    const parentOffset = getElementOffset(parent, this.config.autoFitOverflowOffset);

    const affixedRect = this.affixedRect;
    const baseRect = this.baseRect;

    // A pixel value representing the leeway between the edge of the overflow parent and the edge
    // of the base element before it dissapears from view.
    // If the visible portion of the base element is less than this pixel value, the auto-fit
    // functionality attempts to find another placement.
    const defaultPixelTolerance = 40;
    let pixelTolerance: number;

    const originalOffsetTop = offset.top;
    const originalOffsetLeft = offset.left;

    /* tslint:disable-next-line:switch-default */
    switch (placement) {
      case 'above':
      case 'below':

        // Keep the affixed element within the overflow parent.
        if (offset.left < parentOffset.left) {
          offset.left = parentOffset.left;
        } else if (offset.left + affixedRect.width > parentOffset.right) {
          offset.left = parentOffset.right - affixedRect.width;
        }

        // Use a smaller pixel tolerance if the base element width is less than the default.
        pixelTolerance = Math.min(
          defaultPixelTolerance,
          baseRect.width
        );

        // Make sure the affixed element never detaches from the base element.
        if (
          offset.left + pixelTolerance > baseRect.right ||
          offset.left + affixedRect.width - pixelTolerance < baseRect.left
        ) {
          offset.left = originalOffsetLeft;
        }

        break;

      case 'left':
      case 'right':

        // Keep the affixed element within the overflow parent.
        if (offset.top < parentOffset.top) {
          offset.top = parentOffset.top;
        } else if (offset.top + affixedRect.height > parentOffset.bottom) {
          offset.top = parentOffset.bottom - affixedRect.height;
        }

        // Use a smaller pixel tolerance if the base element height is less than the default.
        pixelTolerance = Math.min(
          defaultPixelTolerance,
          baseRect.height
        );

        // Make sure the affixed element never detaches from the base element.
        if (
          offset.top + pixelTolerance > baseRect.bottom ||
          offset.top + affixedRect.height - pixelTolerance < baseRect.top
        ) {
          offset.top = originalOffsetTop;
        }

        break;
    }

    return offset;
  }

  private getImmediateOverflowParent(): HTMLElement {
    const numParents = this.overflowParents.length;
    const bodyElement = this.overflowParents[0];

    if (numParents === 1) {
      return bodyElement;
    }

    return (this.config.autoFitContext === SkyAffixAutoFitContext.OverflowParent)
      ? this.overflowParents[numParents - 1]
      : bodyElement;
  }

  private emitPlacementChange(placement: SkyAffixPlacement | null): void {
    if (this.currentPlacement !== placement) {
      this.currentPlacement = placement;
      this._placementChange.next({
        placement
      });
    }
  }

  private reset(): void {
    this.removeScrollListeners();
    this.removeResizeListener();
    this.removeMutationObserver();

    this._config =
      this.affixedRect =
      this.baseElement =
      this.baseRect =
      this.overflowParents = undefined;
  }

  private isNewOffset(offset: SkyAffixOffset): boolean {
    if (this.currentOffset === undefined) {
      this.currentOffset = offset;
      return true;
    }

    if (
      this.currentOffset.top === offset.top &&
      this.currentOffset.left === offset.left
    ) {
      return false;
    }

    this.currentOffset = offset;

    return true;
  }

  private addScrollListeners(): void {
    this.scrollListeners = this.overflowParents.map((parentElement) => {
      const overflow = (parentElement === document.body) ? 'window' : parentElement;
      return this.renderer.listen(overflow, 'scroll', () => {
        this.affix();
        this._overflowScroll.next();
      });
    });
  }

  private addResizeListener(): void {
    this.resizeListener = Observable.fromEvent(window, 'resize')
      .subscribe(() => this.affix());
  }

  private addMutationObserver(): void {
    this.observer = this.observerService.create(() => {
      this.affix();
    });

    this.observer.observe(this.affixedElement, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
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

  private removeMutationObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

}
