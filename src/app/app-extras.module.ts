import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  DynamicComponentDemoExampleComponent
} from './demos/dynamic-component/dynamic-component-example.component';

import {
  SkyAffixModule,
  SkyCoreAdapterModule,
  SkyDynamicComponentModule,
  SkyMediaQueryModule,
  SkyNumericModule,
  SkyViewkeeperModule
} from './public';

@NgModule({
  exports: [
    SkyAffixModule,
    SkyAppLinkModule,
    SkyCoreAdapterModule,
    SkyDynamicComponentModule,
    SkyMediaQueryModule,
    SkyNumericModule,
    SkyViewkeeperModule
  ],
  entryComponents: [
    DynamicComponentDemoExampleComponent
  ]
})
export class AppExtrasModule { }
