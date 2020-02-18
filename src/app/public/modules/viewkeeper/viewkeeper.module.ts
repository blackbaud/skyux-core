import {
  NgModule
} from '@angular/core';

import {
  SkyViewkeeperDirective
} from './viewkeeper.directive';

import {
  SkyViewkeeperService
} from './viewkeeper.service';

@NgModule({
  declarations: [
    SkyViewkeeperDirective
  ],
  exports: [
    SkyViewkeeperDirective
  ],
  providers: [
    SkyViewkeeperService
  ]
})
export class SkyViewkeeperModule { }
