import {
  Subscription
} from 'rxjs/Subscription';

import {
  SkyMediaBreakpoints
} from './media-breakpoints';

import {
  SkyMediaQueryListener
} from './media-query-listener';

export interface SkyMediaQueryDetector {

  current: SkyMediaBreakpoints;

  subscribe(listener: SkyMediaQueryListener): Subscription;

}
