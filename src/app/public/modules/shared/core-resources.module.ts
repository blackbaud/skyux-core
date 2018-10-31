// #region imports
import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n/modules/i18n/lib-resources-providers-token';

import {
  SkyCoreResourcesProvider
} from '../../plugin-resources/core-resources-provider';
// #endregion

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyCoreResourcesProvider,
    multi: true
  }]
})
export class SkyCoreResourcesModule { }
