import { NgModule } from '@angular/core';

import { SkyFocusTrapDirective } from './focus-trap.directive';

@NgModule({
  declarations: [SkyFocusTrapDirective],
  exports: [SkyFocusTrapDirective],
})
export class SkyFocusTrapModule {}
