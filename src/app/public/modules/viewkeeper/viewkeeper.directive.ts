import {
  Directive,
  ElementRef,
  Input,
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
export class SkyViewkeeperDirective implements OnInit {

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

  constructor(
    private el: ElementRef,
    private viewkeeperSvc: SkyViewkeeperService
  ) { }

  public ngOnInit() {
    this.observer = new MutationObserver(() => this.detectElements());

    this.observer.observe(
      this.el.nativeElement,
      {
        subtree: true
      }
    );
  }

  private getViewkeeperEls(): HTMLElement[] {
    let viewkeeperEls: HTMLElement[] = [];

    if (this.skyViewkeeper) {
      for (const item of this.skyViewkeeper) {
        let viewkeeperEl: HTMLElement;

        if (typeof item === 'string') {
          viewkeeperEl = this.el.nativeElement.querySelector(item);
        } else if (item instanceof ElementRef) {
          viewkeeperEl = item.nativeElement;
        } else {
          viewkeeperEl = item;
        }

        if (viewkeeperEl) {
          viewkeeperEls.push(viewkeeperEl);
        }
      }
    }

    return undefined;
  }

  private detectElements(): void {
    for (const viewkeeper of this.viewkeepers) {
      viewkeeper.destroy();
    }

    this.viewkeepers = [];

    if (this.skyViewkeeper) {
      let previousViewkeeperEl: HTMLElement;

      for (const item of this.skyViewkeeper) {
        let viewkeeperEl: HTMLElement;

        if (typeof item === 'string') {
          viewkeeperEl = this.el.nativeElement.querySelector(item);
        } else if (item instanceof ElementRef) {
          viewkeeperEl = item.nativeElement;
        } else {
          viewkeeperEl = item;
        }

        if (viewkeeperEl) {
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
      }
    }
  }
}
