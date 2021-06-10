import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';

import {
  SkyI18nModule,
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyCoreResourcesProvider
} from '../../plugin-resources/core-resources-provider';

import {
  SkyNumericPipe
} from './numeric.pipe';

@NgModule({
  declarations: [
    SkyNumericPipe
  ],
  providers: [
    SkyNumericPipe
  ],
  imports: [
    SkyI18nModule
  ],
  exports: [
    SkyNumericPipe
  ]
})
export class SkyNumericModule {
  public static forRoot(): ModuleWithProviders<SkyNumericModule> {
    return {
      ngModule: SkyNumericModule,
      providers: [{
        provide: SKY_LIB_RESOURCES_PROVIDERS,
        useClass: SkyCoreResourcesProvider,
        multi: true
      }]
    };
  }
}
