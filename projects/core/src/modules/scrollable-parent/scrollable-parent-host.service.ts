import { ElementRef, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { take } from "rxjs/operators";
import { MutationObserverService } from "../mutation/mutation-observer-service";
import { SkyAppWindowRef } from "../window/window-ref";

@Injectable({
  providedIn: 'root'
})
export class SkyScrollableParentHostService {

  constructor(
    private mutationObserverSvc: MutationObserverService,
    private windowRef: SkyAppWindowRef
  ) { }

  public getScrollabeParent(elementRef: ElementRef): HTMLElement | Window {
    return this.findScrollableParent(elementRef.nativeElement);
  }

  public watchScrollableParent(elementRef: ElementRef, completionObservable: Observable<void>): Observable<HTMLElement | Window> {
    let scrollableParent = this.findScrollableParent(elementRef.nativeElement);
    let behaviorSubject = new BehaviorSubject(scrollableParent);

    const mutationObserver = this.mutationObserverSvc.create(() => {
      let newScrollableParent = this.findScrollableParent(elementRef.nativeElement);

      if (newScrollableParent !== scrollableParent) {
        scrollableParent = newScrollableParent;
        this.observeForScrollableParentChanges(scrollableParent, mutationObserver);
        behaviorSubject.next(scrollableParent);
      }
    });
    this.observeForScrollableParentChanges(scrollableParent, mutationObserver);

    completionObservable.pipe(take(1)).subscribe(() => {
      mutationObserver.disconnect();
    })

    return behaviorSubject;
  }

  private findScrollableParent(element: any): HTMLElement | Window {
    const regex = /(auto|scroll)/;
    const windowObj = this.windowRef.nativeWindow;
    const bodyObj = windowObj.document.body;

    let style = windowObj.getComputedStyle(element);
    let parent = element;

    do {
      parent = parent.parentNode;
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

  private observeForScrollableParentChanges(element: HTMLElement | Window, mutationObserver: MutationObserver) {
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
