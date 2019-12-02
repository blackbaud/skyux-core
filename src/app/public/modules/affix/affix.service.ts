import {
  ElementRef,
  Injectable,
  Renderer2
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';

import {
  SkyAffixConfig
} from './affix-config';

import { SkyAppWindowRef } from '../window';

@Injectable()
export class SkyAffixService {

  constructor(
    private renderer: Renderer2,
    private windowRef: SkyAppWindowRef
  ) { }

  public affixTo(
    subject: ElementRef,
    target: ElementRef,
    config?: SkyAffixConfig
  ): void {

    const defaults: SkyAffixConfig = {
      horizontalAlignment: 'center',
      verticalAlignment: 'bottom',
      isSticky: false
    };

    // Reset the height.
    // this.renderer.removeStyle(
    //   subject.nativeElement,
    //   'height'
    // );

    // this.renderer.removeStyle(
    //   subject.nativeElement,
    //   'width'
    // );

    const settings = Object.assign({}, defaults, config);

    this.setCoordinates(subject, target, settings);

    if (settings.isSticky) {
      const windowObj = this.windowRef.nativeWindow;

      Observable
        .fromEvent(windowObj, 'resize')
        .subscribe(() => {
          this.setCoordinates(subject, target, settings);
        });

      Observable
        .fromEvent(windowObj, 'scroll')
        .subscribe(() => {
          this.setCoordinates(subject, target, settings);
        });
    }

    this.renderer.setStyle(subject.nativeElement, 'position', 'fixed');

    // If subject's bottom is below viewport, set its height to accommodate.
    // See: https://stackoverflow.com/a/8876069/6178885
    // const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    // if (subjectRect.height + top >= viewportHeight) {
    //   this.renderer.setStyle(
    //     subject.nativeElement,
    //     'height',
    //     `${viewportHeight - top}px`
    //   );
    // }

    // // If subject's right is beyond the body's boundaries,
    // // set its width to accommodate.
    // // See: https://stackoverflow.com/a/8340177/6178885
    // const viewportWidth = document.body.clientWidth;
    // if (subjectRect.width + left >= viewportWidth) {
    //   this.renderer.setStyle(
    //     subject.nativeElement,
    //     'width',
    //     `${viewportWidth - left}px`
    //   );
    // }
  }

  private setCoordinates(subject: ElementRef, target: ElementRef, settings: SkyAffixConfig): void {
    const subjectRect = subject.nativeElement.getBoundingClientRect();
    const targetRect = target.nativeElement.getBoundingClientRect();

    const { top, left } = this.getPreferredCoordinates(subjectRect, targetRect, settings);
    const { top: adjustedTop, left: adjustedLeft } = this.getCoordinatesAdjustedToViewport(top, left, targetRect);

    this.renderer.setStyle(subject.nativeElement, 'top', `${adjustedTop}px`);
    this.renderer.setStyle(subject.nativeElement, 'left', `${adjustedLeft}px`);
  }

  private getPreferredCoordinates(subjectRect: ClientRect, targetRect: ClientRect, settings: SkyAffixConfig): { top: number, left: number} {
    let top: number;
    switch (settings.verticalAlignment) {

      default:
      case 'top':
        top = targetRect.top - subjectRect.height;
        break;

      case 'middle':
        top = targetRect.top + (targetRect.height / 2) - (subjectRect.height / 2);
        break;

      case 'bottom':
        top = targetRect.bottom;
        break;

    }

    let left: number;
    switch (settings.horizontalAlignment) {
      default:
      case 'left':
        left = targetRect.left;
        break;

      case 'center':
        left = targetRect.left + (targetRect.width / 2) - (subjectRect.width / 2);
        break;

      case 'right':
        left = targetRect.right - subjectRect.width;
        break;
    }

    return {
      top,
      left
    };
  }

  private getCoordinatesAdjustedToViewport(top: number, left: number, targetRect: ClientRect): { top: number, left: number } {
    if (top < 0) {
      top = 0;
      if (targetRect.top < 0) {
        top = targetRect.top;
      }
    }

    if (left < 0) {
      left = 0;
      if (targetRect.left < 0) {
        left = targetRect.left;
      }
    }

    return {
      top,
      left
    };
  }
}
