import {
  ElementRef,
  Injectable,
  OnDestroy,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  MutationObserverService
} from '../mutation/mutation-observer-service';

import {
  fromEvent as observableFromEvent,
  Subject
} from 'rxjs';

import {
  debounceTime,
  takeUntil
} from 'rxjs/operators';

let componentIdIndex = 0;

/**
 * @internal
 */
@Injectable()
export class SkyDockDomAdapterService implements OnDestroy {

  private container: HTMLElement;

  private currentDockHeight: number;

  private ngUnsubscribe = new Subject<void>();

  private mutationObserver: MutationObserver;

  private renderer: Renderer2;

  private styleElement: HTMLStyleElement;

  private uniqueClass: string;

  constructor(
    private mutationService: MutationObserverService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
    this.uniqueClass = 'sky-dock-host-' + componentIdIndex;
    componentIdIndex++;
  }

  public ngOnDestroy(): void {
    this.mutationObserver.disconnect();
    this.ngUnsubscribe.next();

    if (this.styleElement) {
      this.destroyStyleElement();
    }

    this.currentDockHeight =
      this.ngUnsubscribe =
      this.mutationObserver =
      this.styleElement = undefined;

    this.renderer.removeClass(this.container, this.uniqueClass);
  }

  public setZIndex(zIndex: number, elementRef: ElementRef): void {
    this.renderer.setStyle(elementRef.nativeElement, 'z-index', zIndex);
  }

  public unbindFromBottom(elementRef: ElementRef): void {
    this.renderer.addClass(elementRef.nativeElement, 'sky-dock-unbound');
  }

  public watchDomChanges(targetElement: HTMLElement, elementRef: ElementRef): void {
    if (!this.mutationObserver) {
      this.container = targetElement;
      this.mutationObserver = this.mutationService.create(() => {
        this.adjustContainerStyles(elementRef);
      });

      this.mutationObserver.observe(elementRef.nativeElement, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });

      observableFromEvent(window, 'resize')
        .pipe(
          debounceTime(250),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(() => this.adjustContainerStyles(elementRef));
    }
  }

  private adjustContainerStyles(elementRef: ElementRef): void {
    const dockHeight = elementRef.nativeElement.getBoundingClientRect().height;
    if (dockHeight === this.currentDockHeight) {
      return;
    }

    this.renderer.removeClass(this.container, this.uniqueClass);

    const originalMargin = window.getComputedStyle(this.container).marginBottom;

    this.renderer.addClass(this.container, this.uniqueClass);

    // Create a style element to avoid overwriting any existing inline body styles.
    const styleElement = this.renderer.createElement('style');
    const textNode = this.renderer.createText(`.` + this.uniqueClass + `{ margin-bottom: calc(${originalMargin} + ${dockHeight}px) !important; }`);

    // Apply a `data-` attribute to make unit testing easier.
    this.renderer.setAttribute(
      styleElement,
      'data-test-selector',
      'sky-layout-dock-bottom-styles'
    );

    this.renderer.appendChild(styleElement, textNode);
    this.renderer.appendChild(document.head, styleElement);

    if (this.styleElement) {
      this.destroyStyleElement();
    }

    this.currentDockHeight = dockHeight;
    this.styleElement = styleElement;
  }

  private destroyStyleElement(): void {
    this.renderer.removeChild(document.head, this.styleElement);
  }

}
