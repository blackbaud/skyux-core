import { Injectable, ElementRef } from '@angular/core';
import { SkyAppWindowRef } from '../window/window-ref';

/**
 * @internal
 */
@Injectable()
export class SkyFocusTrapAdapterService {
  private docRef: any;

  constructor(private windowRef: SkyAppWindowRef) {
    this.docRef = this.windowRef.nativeWindow.document;
  }

  public getActiveElement(): HTMLElement {
    return <HTMLElement>this.docRef.activeElement;
  }

  public isFocusInFirstItem(
    event: KeyboardEvent,
    list: Array<HTMLElement>
  ): boolean {
    /* istanbul ignore next */
    /* sanity check */
    let eventTarget = event.target || event.srcElement;
    return list.length > 0 && eventTarget === list[0];
  }

  public isFocusInLastItem(
    event: KeyboardEvent,
    list: Array<HTMLElement>
  ): boolean {
    /* istanbul ignore next */
    /* sanity check */
    let eventTarget = event.target || event.srcElement;
    return list.length > 0 && eventTarget === list[list.length - 1];
  }

  public isElementFocused(event: KeyboardEvent, element: ElementRef): boolean {
    /* istanbul ignore next */
    /* sanity check */
    let eventTarget = event.target || event.srcElement;
    return eventTarget === element.nativeElement;
  }

  focusElementByIndex(list: HTMLElement[], index: number): boolean {
    /* istanbul ignore else */
    /* sanity check */
    if (list.length > 0 && index < list.length) {
      list[index].focus();
      return true;
    } else {
      return false;
    }
  }
}
