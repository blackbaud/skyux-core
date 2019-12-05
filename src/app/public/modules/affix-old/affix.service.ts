import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

// import {
//   Observable
// } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';

import {
  SkyAffixConfig
} from './affix-config';

// import { SkyAppWindowRef } from '../window';
// import { SkyAffixHorizontalAlignment } from './affix-horizontal-alignment';
// import { SkyAffixVerticalAlignment } from './affix-vertical-alignment';
import { SkyAffixDomAdapterService } from './affix-dom-adapter.service';

export interface SkyAffixCoordinates {
  top: number;
  left: number;
  isOutsideViewport: boolean;
}

@Injectable()
export class SkyAffixService {

  private renderer: Renderer2;

  constructor(
    // private windowRef: SkyAppWindowRef,
    private adapter: SkyAffixDomAdapterService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public affixTo(
    subject: ElementRef,
    target: ElementRef,
    config?: SkyAffixConfig
  ): void {

    // const defaults: SkyAffixConfig = {
    //   horizontalAlignment: 'center',
    //   verticalAlignment: 'below',
    //   isSticky: false
    // };

    // Reset the height.
    // this.renderer.removeStyle(
    //   subject.nativeElement,
    //   'height'
    // );

    // this.renderer.removeStyle(
    //   subject.nativeElement,
    //   'width'
    // );

    // const settings = Object.assign({}, defaults, config);

    // this.setCoordinates(subject, target, settings);

    // if (settings.isSticky) {
    //   const windowObj = this.windowRef.nativeWindow;

    //   Observable
    //     .fromEvent(windowObj, 'resize')
    //     .subscribe(() => {
    //       this.setCoordinates(subject, target, settings);
    //     });

    //   Observable
    //     .fromEvent(windowObj, 'scroll')
    //     .subscribe(() => {
    //       this.setCoordinates(subject, target, settings);
    //     });
    // }

    this.positionSubject(subject, target);

    const scrollListeners = this.adapter.getParentScrollListeners(
      target,
      (isElementVisibleWithinScrollable: boolean) => {
        this.positionSubject(subject, target);
        // this.isVisible = isElementVisibleWithinScrollable;
        // this.changeDetector.markForCheck();
      }
    );

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

  private positionSubject(subject: ElementRef, target: ElementRef): void {
    const { top, left } = this.adapter.getPosition({
      subject,
      target
    }, 'above', 'center');

    this.renderer.setStyle(subject.nativeElement, 'position', 'fixed');
    this.renderer.setStyle(subject.nativeElement, 'top', `${top}px`);
    this.renderer.setStyle(subject.nativeElement, 'left', `${left}px`);
  }

  // private setCoordinates(subject: ElementRef, target: ElementRef, settings: SkyAffixConfig): void {
  //   const subjectRect = subject.nativeElement.getBoundingClientRect();
  //   const targetRect = target.nativeElement.getBoundingClientRect();

  //   // const { top, left } = this.getPreferredCoordinates(subjectRect, targetRect, settings);
  //   // const { top: adjustedTop, left: adjustedLeft } = this.getCoordinatesAdjustedToViewport(top, left, subjectRect, targetRect);

  //   const {
  //     top,
  //     left
  //   } = this.getAffixCoordinates(
  //     subjectRect, targetRect, settings
  //   );

  //   // if (isOutsideViewport) {
  //   //   console.log('!!!', top, left, isOutsideViewport);
  //   // }

  //   this.renderer.setStyle(subject.nativeElement, 'top', `${top}px`);
  //   this.renderer.setStyle(subject.nativeElement, 'left', `${left}px`);
  // }

  // private getAffixCoordinates(
  //  subjectRect: ClientRect,
  //  targetRect: ClientRect,
  //  settings: SkyAffixConfig
  // ): { top: number, left: number } {

  //   let top: number;
  //   switch (settings.verticalAlignment) {
  //     default:
  //     case 'above':
  //       top = targetRect.top - subjectRect.height;
  //       break;

  //     case 'middle':
  //       top = targetRect.top + (targetRect.height / 2) - (subjectRect.height / 2);
  //       break;

  //     case 'below':
  //       top = targetRect.bottom;
  //       break;
  //   }

  //   let left: number;
  //   switch (settings.horizontalAlignment) {
  //     default:
  //     case 'left':
  //       left = targetRect.left;
  //       break;
  //     case 'center':
  //       left = targetRect.left + (targetRect.width / 2) - (subjectRect.width / 2);
  //       break;
  //     case 'right':
  //       left = targetRect.right - subjectRect.width;
  //       break;
  //   }

  //   const viewportRight = this.windowRef.nativeWindow.innerWidth;
  //   const viewportBottom = this.windowRef.nativeWindow.innerHeight;

  //   console.log(subjectRect.right, viewportRight);
  //   if (subjectRect.right > viewportRight) {
  //     console.log('set to:', viewportRight, subjectRect.width);
  //     left = viewportRight - subjectRect.width;
  //   }

  //   if (top < 0) {
  //     top = 0;
  //     if (targetRect.top < 0) {
  //       top = targetRect.top;
  //     }
  //   }

  //   if (left < 0) {
  //     left = 0;
  //     if (targetRect.left < 0) {
  //       left = targetRect.left;
  //     }
  //   }

  //   return {
  //     top,
  //     left
  //   };
  // }

  // private getCoordinatesAdjustedToViewport(
  //   top: number, left: number, subjectRect: ClientRect, targetRect: ClientRect
  // ): { top: number, left: number } {
  //   const viewportRight = this.windowRef.nativeWindow.document.clientWidth;
  //   const viewportBottom = this.windowRef.nativeWindow.document.clientHeight;

  //   if (top < 0) {
  //     top = 0;
  //     if (targetRect.top < 0) {
  //       top = targetRect.top;
  //     }
  //   }

  //   if (left < 0) {
  //     left = 0;
  //     if (targetRect.left < 0) {
  //       left = targetRect.left;
  //     }
  //   }

  //   console.log('eh?', subjectRect.right, viewportRight);

  //   if (subjectRect.right > viewportRight) {
  //     left = viewportRight - subjectRect.width - 2;
  //   }

  //   return {
  //     top,
  //     left
  //   };
  // }

  // private getAffixCoordinates(
  //   verticalAlignment: SkyAffixVerticalAlignment,
  //   horizontalAlignment: SkyAffixHorizontalAlignment,
  //   subject: ElementRef,
  //   target: ElementRef
  // ): SkyAffixCoordinates {
  //   const windowObj = this.windowRef.nativeWindow;
  //   const subjectRect = subject.nativeElement.getBoundingClientRect();
  //   const targetRect = target.nativeElement.getBoundingClientRect();

  //   const callerXCenter = targetRect.width / 2;
  //   const scrollRight = windowObj.innerWidth;
  //   const scrollBottom = windowObj.innerHeight;

  //   let top: number;
  //   let left: number;
  //   let bleedLeft = 0;
  //   let bleedRight = 0;
  //   let bleedTop = 0;
  //   let bleedBottom = 0;
  //   let isOutsideViewport = false;

  //   /* tslint:disable-next-line:switch-default */
  //   switch (verticalAlignment) {
  //     case 'above':
  //     top = targetRect.top - subjectRect.height;
  //     bleedTop = top;
  //     break;

  //     case 'below':
  //     top = targetRect.bottom;
  //     bleedBottom = scrollBottom - (top + subjectRect.height);
  //     break;
  //   }

  //   /* tslint:disable-next-line:switch-default */
  //   switch (horizontalAlignment) {
  //     case 'right':
  //     left = targetRect.right;
  //     bleedRight = scrollRight - (left + subjectRect.width);
  //     break;

  //     case 'left':
  //     left = targetRect.left - subjectRect.width;
  //     bleedLeft = left;
  //     break;
  //   }

  //   if (horizontalAlignment === 'right' || horizontalAlignment === 'left') {
  //     top = targetRect.top - (subjectRect.height / 2) + (targetRect.height / 2);
  //     bleedTop = top;
  //     bleedBottom = scrollBottom - (top + subjectRect.height);
  //   }

  //   if (verticalAlignment === 'above' || verticalAlignment === 'below') {

  //     // Make adjustments based on horizontal alignment.
  //     switch (horizontalAlignment) {
  //       default:
  //       case 'center':
  //       left = targetRect.left - (subjectRect.width / 2) + callerXCenter;
  //       break;

  //       case 'left':
  //       left = targetRect.left;
  //       break;

  //       case 'right':
  //       left = targetRect.left - subjectRect.width + targetRect.width;
  //       break;
  //     }

  //     bleedLeft = left;
  //     bleedRight = scrollRight - (left + subjectRect.width);
  //   }

  //   // Clipped on left?
  //   if (bleedLeft < 0) {
  //     if (horizontalAlignment === 'left') {
  //       isOutsideViewport = true;
  //     }

  //     left = 0;
  //   }

  //   // Clipped on right?
  //   if (bleedRight < 0) {
  //     if (horizontalAlignment === 'right') {
  //       isOutsideViewport = true;
  //     }

  //     left += bleedRight;
  //   }

  //   // Clipped on top?
  //   if (bleedTop < 0) {
  //     if (verticalAlignment === 'above') {
  //       isOutsideViewport = true;
  //     }

  //     top -= bleedTop;
  //   }

  //   // Clipped on bottom?
  //   if (bleedBottom < 0) {
  //     if (verticalAlignment === 'below') {
  //       isOutsideViewport = true;
  //     }

  //     top += bleedBottom;
  //   }

  //   return {
  //     top,
  //     left,
  //     isOutsideViewport
  //   };
  // }
}
