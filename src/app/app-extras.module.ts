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
  SkyCoreAdapterModule,
  SkyDynamicComponentModule,
  SkyMediaQueryModule,
  SkyNumericModule,
  SkyViewkeeperModule
} from './public';

import { SkyViewkeeperGlobalOptions } from './public/modules/viewkeeper/viewkeeper-global-options';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCoreAdapterModule,
    SkyDynamicComponentModule,
    SkyMediaQueryModule,
    SkyNumericModule,
    SkyViewkeeperModule
  ],
  entryComponents: [
    DynamicComponentDemoExampleComponent
  ],
  providers: [
    {
      provide: SkyViewkeeperGlobalOptions,
      useValue: {
        viewportMarginTop: 50
      }
    }
  ]
})
export class AppExtrasModule { }
