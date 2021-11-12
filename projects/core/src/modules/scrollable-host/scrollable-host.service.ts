import { ElementRef, Injectable } from "@angular/core";
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { MutationObserverService } from "../mutation/mutation-observer-service";
import { SkyAppWindowRef } from "../window/window-ref";

@Injectable({
  providedIn: 'root'
})
export class SkyScrollableHostService {

  constructor(
    private mutationObserverSvc: MutationObserverService,
    private windowRef: SkyAppWindowRef
  ) { }

  /**
   * Returns the given element's current scrollable host
   * @param elementRef The element whose scrollable host is being requested
   * @returns The current scrollable host
   */
  public getScrollableHost(elementRef: ElementRef): HTMLElement | Window {
    return this.findScrollableHost(elementRef.nativeElement);
  }

  /**
   * Returns an observable which emits the given element's current scrollable host
   * @param elementRef The element whose scrollable host is being requested
   * @param completionObservable An observable which alerts the internal observers that they should complete
   * @returns An observable which emits the current scrollable host
   */
  public watchScrollableHost(elementRef: ElementRef, completionObservable: Observable<void>): Observable<HTMLElement | Window> {
    let scrollableHost = this.findScrollableHost(elementRef.nativeElement);
    let behaviorSubject = new BehaviorSubject(scrollableHost);

    const mutationObserver = this.mutationObserverSvc.create(() => {
      let newScrollableHost = this.findScrollableHost(elementRef.nativeElement);

      if (newScrollableHost !== scrollableHost) {
        scrollableHost = newScrollableHost;
        this.observeForScrollableHostChanges(scrollableHost, mutationObserver);
        behaviorSubject.next(scrollableHost);
      }
    });
    this.observeForScrollableHostChanges(scrollableHost, mutationObserver);

    completionObservable.pipe(take(1)).subscribe(() => {
      mutationObserver.disconnect();
    })

    return behaviorSubject;
  }

  /**
   * Returns an observable which emits whenever the element's scrollable host emits a scroll event. The observable will always emit the scroll events from the elements current scrollable host and will update based on any scrollable host changes. The observable will also emit once whenever the scrollable host changes.
   * @param elementRef The element whose scrollable host scroll events are being requested
   * @param completionObservable An observable which alerts the internal observers that they should complete
   * @returns An observable which emits the scroll events from the given element's scrollable host
   */
  public watchScrollableHostScrollEvents(elementRef: ElementRef, completionObservable: Observable<void>): Observable<void> {
    const scrollEventSubject: Subject<void> = new Subject();
    let newScrollableHostObservable = new Subject();

    this.watchScrollableHost(elementRef, completionObservable)
      .pipe(takeUntil(completionObservable))
      .subscribe((scrollableHost) => {
        newScrollableHostObservable.next();
        newScrollableHostObservable.complete();
        newScrollableHostObservable = new Subject();
        scrollEventSubject.next();
        fromEvent(scrollableHost, 'scroll')
          .pipe(
            takeUntil(merge(completionObservable, newScrollableHostObservable))
          )
          .subscribe(() => {
            scrollEventSubject.next();
          });
      });

    completionObservable.pipe(take(1)).subscribe(() => {
      newScrollableHostObservable.complete();
    });

    return scrollEventSubject;
  }

  private findScrollableHost(element: HTMLElement): HTMLElement | Window {
    const regex = /(auto|scroll)/;
    const windowObj = this.windowRef.nativeWindow;
    const bodyObj = windowObj.document.body;

    /* Sanity check */
    if (!element) {
      return windowObj;
    }

    let style = windowObj.getComputedStyle(element);
    let parent: HTMLElement = element;

    do {
      parent = <HTMLElement> parent.parentNode;

      /* Sanity check for if this function is called for an element which has been removed from the DOM */
      if (!(parent instanceof HTMLElement)) {
        return windowObj
      }

      style = windowObj.getComputedStyle(parent);
    } while (
      !regex.test(style.overflow) &&
      !regex.test(style.overflowY) &&
      parent !== bodyObj
    );

    if (parent === bodyObj) {
      return windowObj;
    }

    return parent;
  }

  private observeForScrollableHostChanges(element: HTMLElement | Window, mutationObserver: MutationObserver) {
    mutationObserver.disconnect();
    if (element instanceof HTMLElement) {
      mutationObserver.observe(element, {
        attributes: true,
        attributeFilter: ["class", "style.overflow", "style.overflow-y"],
        subtree: true
      });
    } else {
      mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style.overflow", "style.overflow-y"],
        subtree: true
      });
    }
  }

}
