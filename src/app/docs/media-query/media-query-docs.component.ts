import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '../../public/public_api';

@Component({
  selector: 'app-media-query-docs',
  templateUrl: './media-query-docs.component.html'
})
export class MediaQueryDocsComponent implements OnDestroy {
  public currentBreakpoint: string;

  private querySubscription: Subscription;

  constructor(private mediaQueries: SkyMediaQueryService) {
    this.querySubscription = this.mediaQueries.subscribe(
      (newBreakpoint: SkyMediaBreakpoints) => {
        switch (newBreakpoint) {
          case SkyMediaBreakpoints.xs:
            this.currentBreakpoint = 'xs';
            break;
          case SkyMediaBreakpoints.sm:
            this.currentBreakpoint = 'sm';
            break;
          case SkyMediaBreakpoints.md:
            this.currentBreakpoint = 'md';
            break;
          case SkyMediaBreakpoints.lg:
            this.currentBreakpoint = 'lg';
            break;
          default:
            this.currentBreakpoint = 'unknown';
        }
      }
    );
  }

  public ngOnDestroy(): void {
    /* istanbul ignore else */
    /* sanity check */
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
