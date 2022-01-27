import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { SkyCoreAdapterService } from '../adapter-service/adapter.service';

import { SkyFocusTrapAdapterService } from './focus-trap-adapter.service';

@Directive({
  selector: '[skyFocusTrap]',
  providers: [SkyFocusTrapAdapterService],
})
export class SkyFocusTrapDirective implements AfterViewInit, OnDestroy {
  private previouslyFocusedElement;

  constructor(
    private adapter: SkyFocusTrapAdapterService,
    private coreAdapter: SkyCoreAdapterService,
    private elRef: ElementRef
  ) {}

  public ngAfterViewInit(): void {
    this.previouslyFocusedElement = this.adapter.getActiveElement();
  }

  public ngOnDestroy(): void {
    /* istanbul ignore else */
    /* sanity check */
    if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
      this.previouslyFocusedElement.focus();
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onDocumentKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      // Tab pressed
      let focusChanged = false;

      let focusElementList = this.coreAdapter.getFocusableChildren(
        this.elRef.nativeElement
      );

      if (
        event.shiftKey &&
        (this.adapter.isFocusInFirstItem(event, focusElementList) ||
          this.adapter.isElementFocused(event, this.elRef))
      ) {
        focusChanged = this.adapter.focusElementByIndex(
          focusElementList,
          focusElementList.length - 1
        );
      } else if (
        !event.shiftKey &&
        this.adapter.isFocusInLastItem(event, focusElementList)
      ) {
        focusChanged = this.adapter.focusElementByIndex(focusElementList, 0);
      }

      if (focusChanged) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
}
