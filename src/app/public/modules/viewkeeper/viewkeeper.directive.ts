import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SkipSelf
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  MutationObserverService
} from '../mutation/mutation-observer-service';

import {
  SkyViewkeeper
} from './viewkeeper';

import {
  SkyViewkeeperGroupService
} from './viewkeeper-group.service';

import {
  SkyViewkeeperService
} from './viewkeeper.service';

let idIndex = 0;

@Directive({
  selector: '[skyViewkeeper]',
  providers: [
    SkyViewkeeperGroupService
  ]
})
export class SkyViewkeeperDirective implements OnInit, OnDestroy {

  @Input()
  public set skyViewkeeper(value: string[]) {
    this._skyViewkeeper = value;

    this.detectElements();
  }

  public get skyViewkeeper(): string[] {
    return this._skyViewkeeper;
  }

  @Input()
  public set skyViewkeeperGroup(value: string) {
    this._skyViewkeeperGroup = value;

    this.groupSvc.groupName = value;

    this.detectElements();
  }

  public get skyViewkeeperGroup(): string {
    return this._skyViewkeeperGroup;
  }

  private _skyViewkeeper: string[];

  private _skyViewkeeperGroup: string;

  private viewkeepers: SkyViewkeeper[] = [];

  private observer: MutationObserver;

  private currentViewkeeperEls: HTMLElement[] = [];

  private id: string;

  private ngUnsubscribe = new Subject<any>();

  constructor(
    private el: ElementRef,
    private mutationObserverSvc: MutationObserverService,
    private viewkeeperSvc: SkyViewkeeperService,
    @Self() private groupSvc: SkyViewkeeperGroupService,
    @Optional() @SkipSelf() private parentGroupSvc?: SkyViewkeeperGroupService
  ) {
    this.id = 'sky-viewkeeper-id-' + (++idIndex);
  }

  public ngOnInit(): void {
    this.observer = this.mutationObserverSvc.create(() => this.detectElements());

    this.observer.observe(
      this.el.nativeElement,
      {
        childList: true,
        subtree: true
      }
    );

    this.groupSvc.viewkeeperElsChange
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.detectElements();
      });
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();

    this.destroyViewkeepers();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.groupSvc.destroy();
  }

  private destroyViewkeepers(): void {
    for (const viewkeeper of this.viewkeepers) {
      this.viewkeeperSvc.destroy(viewkeeper);
    }

    this.viewkeepers = [];
  }

  private getViewkeeperEls(): HTMLElement[] {
    let viewkeeperEls: HTMLElement[] = [];

    if (this.skyViewkeeper) {
      for (const item of this.skyViewkeeper) {
        let matchingEls = Array.from(
          (this.el.nativeElement as HTMLElement).querySelectorAll(item)
        ) as HTMLElement[];

        viewkeeperEls = [...viewkeeperEls, ...matchingEls];
      }
    }

    return viewkeeperEls;
  }

  private viewkeeperElsChanged(viewkeeperEls: HTMLElement[]): boolean {
    if (viewkeeperEls.length !== this.currentViewkeeperEls.length) {
      return true;
    }

    for (let i = 0, n = viewkeeperEls.length; i < n; i++) {
      if (viewkeeperEls[i] !== this.currentViewkeeperEls[i]) {
        return true;
      }
    }

    return false;
  }

  private detectElements(): void {
    let viewkeeperEls = this.getViewkeeperEls();

    if (this.parentGroupSvc && this.parentGroupSvc.groupName === this.skyViewkeeperGroup) {
      this.destroyViewkeepers();

      this.parentGroupSvc.setViewkeeperEls(this.id, viewkeeperEls);
    } else {
      viewkeeperEls = viewkeeperEls.concat(
        this.groupSvc.getGroupViewkeeperEls()
      );

      if (this.viewkeeperElsChanged(viewkeeperEls)) {
        this.destroyViewkeepers();

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
}
