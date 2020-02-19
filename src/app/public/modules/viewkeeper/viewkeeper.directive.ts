import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  SkyViewkeeper
} from './viewkeeper';

import {
  SkyViewkeeperService
} from './viewkeeper.service';

@Directive({
  selector: '[skyViewkeeper]'
})
export class SkyViewkeeperDirective implements OnInit, OnDestroy {

  @Input()
  public set skyViewkeeper(value: Array<string | ElementRef | HTMLElement>) {
    this._skyViewkeeper = value;

    this.detectElements();
  }

  public get skyViewkeeper(): Array<string | ElementRef | HTMLElement> {
    return this._skyViewkeeper;
  }

  private _skyViewkeeper: Array<string | ElementRef | HTMLElement>;

  private viewkeepers: SkyViewkeeper[] = [];

  private observer: MutationObserver;

  private currentViewkeeperEls: HTMLElement[];

  constructor(
    private el: ElementRef,
    private viewkeeperSvc: SkyViewkeeperService
  ) { }

  public ngOnInit() {
    this.observer = new MutationObserver(() => this.detectElements());

    this.observer.observe(
      this.el.nativeElement,
      {
        childList: true,
        subtree: true
      }
    );
  }

  public ngOnDestroy() {
    this.observer.disconnect();

    for (const viewkeeper of this.viewkeepers) {
      viewkeeper.destroy();
    }
  }

  private arrayFromNodeList(nodes: NodeList): HTMLElement[] {
    const elArray: HTMLElement[] = [];

    nodes.forEach((node) => elArray.push(node as HTMLElement));

    return elArray;
  }

  private getViewkeeperEls(): HTMLElement[] {
    let viewkeeperEls: HTMLElement[] = [];

    if (this.skyViewkeeper) {
      for (const item of this.skyViewkeeper) {
        let matchingEls: HTMLElement[];

        if (typeof item === 'string') {
          matchingEls = this.arrayFromNodeList(
            (this.el.nativeElement as HTMLElement).querySelectorAll(item)
          );
        } else if (item instanceof ElementRef) {
          matchingEls = [item.nativeElement];
        } else {
          matchingEls = [item];
        }

        if (matchingEls) {
          viewkeeperEls = [...viewkeeperEls, ...matchingEls];
        }
      }
    }

    return viewkeeperEls;
  }

  private viewkeeperElsChanged(viewkeeperEls: HTMLElement[]): boolean {
    if (!viewkeeperEls !== !this.currentViewkeeperEls) {
      return true;
    }

    if (viewkeeperEls && this.currentViewkeeperEls) {
      if (viewkeeperEls.length !== this.currentViewkeeperEls.length) {
        return true;
      }

      for (let i = 0, n = viewkeeperEls.length; i < n; i++) {
        if (viewkeeperEls[i] !== this.currentViewkeeperEls[i]) {
          return true;
        }
      }
    }

    return false;
  }

  private detectElements(): void {
    let viewkeeperEls = this.getViewkeeperEls();

    if (this.viewkeeperElsChanged(viewkeeperEls)) {
      for (const viewkeeper of this.viewkeepers) {
        this.viewkeeperSvc.destroy(viewkeeper);
      }

      this.viewkeepers = [];

      let previousViewkeeperEl: HTMLElement;

      for (const viewkeeperEl of viewkeeperEls) {
        this.viewkeepers.push(
          this.viewkeeperSvc.create(
            {
              boundaryEl: this.el.nativeElement,
              el: viewkeeperEl,
              setWidth: true,
              verticalOffsetEl: previousViewkeeperEl
            }
          )
        );

        previousViewkeeperEl = viewkeeperEl;
      }

      this.currentViewkeeperEls = viewkeeperEls;
    }
  }
}
