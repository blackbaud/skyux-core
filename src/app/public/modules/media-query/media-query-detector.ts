/**
 * Use this abstract class when you wish to provide a different
 * class with the same interface as SkyMediaQueryService.
 */

import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  Subscription
} from 'rxjs/Subscription';

import {
  SkyMediaBreakpoints
} from './media-breakpoints';

import {
  SkyMediaQueryListener
} from './media-query-listener';

@Injectable()
export abstract class SkyMediaQueryDetector {

  public get current(): SkyMediaBreakpoints {
    if (this._current === undefined) {
      return SkyMediaBreakpoints.md;
    }

    return this._current;
  }

  protected currentSubject = new BehaviorSubject<SkyMediaBreakpoints>(this.current);

  protected _current: SkyMediaBreakpoints;

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.currentSubject.subscribe({
      next: (breakpoints: SkyMediaBreakpoints) => {
        listener(breakpoints);
      }
    });
  }
}
