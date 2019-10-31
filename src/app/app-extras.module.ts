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
  OverlayDemoExampleComponent
} from './demos/overlay/overlay-demo-example.component';

import {
  SkyCoreAdapterModule,
  SkyDynamicComponentModule,
  SkyMediaQueryModule,
  SkyNumericModule,
  SkyOverlayModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCoreAdapterModule,
    SkyDynamicComponentModule,
    SkyMediaQueryModule,
    SkyNumericModule,
    SkyOverlayModule
  ],
  entryComponents: [
    DynamicComponentDemoExampleComponent,
    OverlayDemoExampleComponent
  ]
})
export class AppExtrasModule { }
