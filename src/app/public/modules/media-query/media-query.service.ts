import {
  Injectable,
  NgZone
} from '@angular/core';

import {
  SkyMediaBreakpoints
} from './media-breakpoints';

import {
  SkyMediaQueryDetector
} from './media-query-detector';

@Injectable()
export class SkyMediaQueryService extends SkyMediaQueryDetector {

  public static xs = '(max-width: 767px)';
  public static sm = '(min-width: 768px) and (max-width: 991px)';
  public static md = '(min-width: 992px) and (max-width: 1199px)';
  public static lg = '(min-width: 1200px)';

  private xsMql: MediaQueryList;
  private smMql: MediaQueryList;
  private mdMql: MediaQueryList;
  private lgMql: MediaQueryList;

  private xsListener: MediaQueryListListener;
  private smListener: MediaQueryListListener;
  private mdListener: MediaQueryListListener;
  private lgListener: MediaQueryListListener;

  constructor(
    private zone: NgZone
  ) {
    super();

    this.xsListener = (mql: MediaQueryList) => {
      this.setupListener(mql, SkyMediaBreakpoints.xs);
    };

    this.smListener = (mql: MediaQueryList) => {
      this.setupListener(mql, SkyMediaBreakpoints.sm);
    };

    this.mdListener = (mql: MediaQueryList) => {
      this.setupListener(mql, SkyMediaBreakpoints.md);
    };

    this.lgListener = (mql: MediaQueryList) => {
      this.setupListener(mql, SkyMediaBreakpoints.lg);
    };

    this.xsMql = matchMedia(SkyMediaQueryService.xs);
    this.xsMql.addListener(this.xsListener);

    this.smMql = matchMedia(SkyMediaQueryService.sm);
    this.smMql.addListener(this.smListener);

    this.mdMql = matchMedia(SkyMediaQueryService.md);
    this.mdMql.addListener(this.mdListener);

    this.lgMql = matchMedia(SkyMediaQueryService.lg);
    this.lgMql.addListener(this.lgListener);

    this.setupListener(this.xsMql, SkyMediaBreakpoints.xs);
    this.setupListener(this.smMql, SkyMediaBreakpoints.sm);
    this.setupListener(this.mdMql, SkyMediaBreakpoints.md);
    this.setupListener(this.lgMql, SkyMediaBreakpoints.lg);
  }

  public destroy(): void {
    this.xsMql.removeListener(this.xsListener);
    this.xsMql = undefined;
    this.xsListener = undefined;

    this.smMql.removeListener(this.smListener);
    this.smMql = undefined;
    this.smListener = undefined;

    this.mdMql.removeListener(this.mdListener);
    this.mdMql = undefined;
    this.mdListener = undefined;

    this.lgMql.removeListener(this.lgListener);
    this.lgMql = undefined;
    this.lgListener = undefined;

    this.currentSubject.complete();
  }

  private setupListener(
    mql: MediaQueryList,
    breakpoints: SkyMediaBreakpoints
  ): void {
    this.zone.run(() => {
      if (mql.matches) {
        this._current = breakpoints;
        this.currentSubject.next(breakpoints);
      }
    });
  }
}
