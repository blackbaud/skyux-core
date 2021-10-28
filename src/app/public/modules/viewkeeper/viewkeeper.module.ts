import {
  NgModule
} from '@angular/core';

import {
  SkyViewkeeperDirective
} from './viewkeeper.directive';

import {
  SkyViewkeeperService
} from './viewkeeper.service';

import {
  MutationObserverService
} from '../mutation/mutation-observer-service';
import { SkyScrollableHostModule } from '../scrollable-host/scrollable-host.module';

@NgModule({
  declarations: [
    SkyViewkeeperDirective
  ],
  imports: [
    SkyScrollableHostModule
  ],
  exports: [
    SkyViewkeeperDirective
  ],
  providers: [
    SkyViewkeeperService,
    MutationObserverService
  ]
})
export class SkyViewkeeperModule { }
