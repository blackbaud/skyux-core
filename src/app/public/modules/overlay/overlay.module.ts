import {
  CommonModule
} from '@angular/common';

import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';

import {
  SkyOverlayAdapterService
} from './overlay-adapter.service';

import {
  SkyOverlayComponent
} from './overlay.component';

import {
  SkyOverlayService
} from './overlay.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SkyOverlayComponent
  ],
  entryComponents: [
    SkyOverlayComponent
  ]
})
export class SkyOverlayModule {
  // Prevent this module from being imported more than once.
  // @see: https://angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule
  constructor(@Optional() @SkipSelf() parentModule?: SkyOverlayModule) {
    if (parentModule) {
      throw new Error(
        'SkyOverlayModule is already loaded. Import it in the AppModule only.'
      );
    }
  }

  public static forRoot(): ModuleWithProviders<SkyOverlayModule> {
    return {
      ngModule: SkyOverlayModule,
      providers: [
        SkyOverlayAdapterService,
        SkyOverlayService
      ]
    };
  }
}
