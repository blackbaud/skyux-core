import {
  CommonModule
} from '@angular/common';

import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { SKY_LIB_RESOURCES_PROVIDERS } from '@skyux/i18n';
import { SkyCoreResourcesProvider } from '../../plugin-resources/core-resources-provider';
import { SkyNumericModule } from '../numeric/numeric.module';

import {
  SkyPercentPipe
} from './percent.pipe';

@NgModule({
  declarations: [
    SkyPercentPipe
  ],
  providers: [
    SkyPercentPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyPercentPipe
  ]
})
export class SkyPercentPipeModule {
  public static forRoot(): ModuleWithProviders<SkyPercentPipeModule> {
    return {
      ngModule: SkyPercentPipeModule,
      providers: [{
        provide: SKY_LIB_RESOURCES_PROVIDERS,
        useClass: SkyCoreResourcesProvider,
        multi: true
      }]
    };
  }
}
