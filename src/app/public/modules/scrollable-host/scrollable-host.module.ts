import {
  NgModule
} from '@angular/core';
import { MutationObserverService } from '../mutation/mutation-observer-service';

import {
  SkyAppWindowRef
} from '../window/window-ref';

@NgModule({
  providers: [
    MutationObserverService,
    SkyAppWindowRef
  ]
})
export class SkyScrollableHostModule { }
