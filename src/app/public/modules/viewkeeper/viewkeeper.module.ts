import { NgModule } from '@angular/core';

import { MutationObserverService } from '../mutation/mutation-observer-service';

import { SkyViewkeeperDirective } from './viewkeeper.directive';
import { SkyViewkeeperService } from './viewkeeper.service';

@NgModule({
  declarations: [SkyViewkeeperDirective],
  exports: [SkyViewkeeperDirective],
  providers: [SkyViewkeeperService, MutationObserverService]
})
export class SkyViewkeeperModule {}
