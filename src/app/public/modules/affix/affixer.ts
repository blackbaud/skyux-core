import {
  ElementRef,
  Renderer2
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyAffixConfig
} from './affix-config';

import {
  SkyAffixHorizontalAlignment
} from './affix-horizontal-alignment';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  SkyAffixerTargetVisibilityArgs
} from './affixer-target-visibility-args';

import {
  getScrollableParentElements
} from './dom-utils';
import { SkyAppWindowRef } from '../window';

export class SkyAffixer {

  public get targetVisibility(): Observable<SkyAffixerTargetVisibilityArgs> {
    return this._targetVisibility.asObservable();
  }

  private _targetVisibility = new BehaviorSubject<SkyAffixerTargetVisibilityArgs>({
    isVisible: false
  });

  private intersectionObservers: IntersectionObserver[] = [];

  private isTargetVisible: boolean = false;

  private scrollListeners: Function[] = [];

  private settings: SkyAffixConfig;

  private subjectDestroyedObserver: MutationObserver;

  private target: ElementRef;

  constructor(
    private subject: ElementRef,
    private renderer: Renderer2,
    private windowRef: SkyAppWindowRef
  ) {
    this.addSubjectDestroyedObserver(this.subject);
  }

  public affixTo(target: ElementRef, config?: SkyAffixConfig): void {
    this.settings = this.validateConfig(config);
    this.target = target;

    this.affix();

    this.removeIntersectionObservers();
    this.removeScrollListeners();

    if (this.settings.isSticky) {
      this.addIntersectionObservers();
      this.addScrollListeners();
    }
  }

  private affix(): void {
    const { top, left } = this.getCoordinates(
      this.target,
      this.subject,
      this.settings.placement,
      this.settings.horizontalAlignment
    );

    const subjectElement = this.subject.nativeElement;
    this.renderer.setStyle(subjectElement, 'top', `${top}px`);
    this.renderer.setStyle(subjectElement, 'left', `${left}px`);
  }

  private getCoordinates(
    target: ElementRef,
    subject: ElementRef,
    placement: SkyAffixPlacement,
    alignment: SkyAffixHorizontalAlignment
  ): {
    top: number;
    left: number;
    isOutsideViewport: boolean;
  } {
    const windowObj = window;
    const subjectRect = subject.nativeElement.getBoundingClientRect();
    const targetRect = target.nativeElement.getBoundingClientRect();

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

  private addSubjectDestroyedObserver(subject: ElementRef): void {
    const observer = new MutationObserver(mutations => {
      if (mutations[0].removedNodes) {
        this.destroy();
      }
    });

    observer.observe(subject.nativeElement.parentElement, {
      childList: true
    });

    this.subjectDestroyedObserver = observer;
  }

  private addIntersectionObservers(): void {
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => this.notifyTargetVisibility(entry.isIntersecting));
    };

    const scrollableParents = getScrollableParentElements(this.target);

    const observers = scrollableParents.map((parent) => {
      const observer = new IntersectionObserver(callback, {
        root: (parent === this.windowRef.nativeWindow.document.body) ? undefined : parent
      });

      observer.observe(this.target.nativeElement);

      return observer;
    });

    this.intersectionObservers = observers;
  }

  private addScrollListeners(): void {
    this.scrollListeners = this.getParentScrollListeners(
      this.target,
      () => this.affix()
    );
  }

  private getParentScrollListeners(elementRef: ElementRef, callback: () => void): Function[] {
    const bodyElement = this.windowRef.nativeWindow.document.body;
    const parentElements = getScrollableParentElements(elementRef);
    return parentElements.map((parentElement: HTMLElement) => {
      const scrollable = (parentElement === bodyElement) ? 'window' : parentElement;
      return this.renderer.listen(scrollable, 'scroll', () => callback());
    });
  }

  private validateConfig(config: SkyAffixConfig): SkyAffixConfig {
    const defaults: SkyAffixConfig = {
      isSticky: true,
      placement: 'below',
      horizontalAlignment: 'left'
    };
    return {...defaults, ...config || {}};
  }

  private notifyTargetVisibility(isVisible: boolean): void {
    if (this.isTargetVisible !== isVisible) {
      this.isTargetVisible = isVisible;
      this._targetVisibility.next({ isVisible });
    }
  }

  private destroy(): void {
    this._targetVisibility.complete();
    this.removeSubjectDestroyedObserver();
    this.removeIntersectionObservers();
    this.removeScrollListeners();
  }

  private removeIntersectionObservers(): void {
    if (this.intersectionObservers.length) {
      this.intersectionObservers.forEach((observer) => {
        observer.disconnect();
      });
      this.intersectionObservers = [];
    }
  }

  private removeScrollListeners(): void {
    if (this.scrollListeners) {
      this.scrollListeners.forEach((listener: any) => {
        // Remove renderer-generated listeners by calling the listener itself.
        // https://github.com/angular/angular/issues/9368#issuecomment-227199778
        listener();
      });

      this.scrollListeners = [];
    }
  }

  private removeSubjectDestroyedObserver(): void {
    if (this.subjectDestroyedObserver) {
      this.subjectDestroyedObserver.disconnect();
      this.subjectDestroyedObserver = undefined;
    }
  }

}
