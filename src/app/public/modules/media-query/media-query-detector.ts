/**
 * Use this abstract class when you wish to provide a different
 * class with the same interface as SkyMediaQueryService.
 */

import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  Subject
} from 'rxjs/Subject';

import {
  Subscription
} from 'rxjs/Subscription';

import 'rxjs/add/operator/takeUntil';

import {
  SkyMediaBreakpoints
} from './media-breakpoints';

import {
  SkyMediaQueryListener
} from './media-query-listener';

@Injectable()
export abstract class SkyMediaQueryDetector implements OnDestroy {

  public get current(): SkyMediaBreakpoints {
    if (this._current === undefined) {
      return SkyMediaBreakpoints.md;
    }

    return this._current;
  }

  protected currentSubject = new BehaviorSubject<SkyMediaBreakpoints>(this.current);

  protected _current: SkyMediaBreakpoints;

  private ngUnsubscribe = new Subject<void>();

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.currentSubject
      .takeUntil(this.ngUnsubscribe)
      .subscribe({
        next: (breakpoints: SkyMediaBreakpoints) => {
          listener(breakpoints);
        }
      });
  }
}
