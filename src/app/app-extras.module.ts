import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyAlertModule
} from '@skyux/indicators';

import {
  SkyDefinitionListModule,
  SkyFluidGridModule,
  SkyPageModule
} from '@skyux/layout';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  DockItemVisualComponent
} from './demos/dock/dock-item-visual.component';

import {
  DynamicComponentDemoExampleComponent
} from './demos/dynamic-component/dynamic-component-example.component';

import {
  OverlayDemoExampleComponent
} from './demos/overlay/overlay-demo-example.component';

import {
  SkyAffixModule,
  SkyDockModule,
  SkyIdModule,
  SkyNumericModule,
  SkyOverlayModule,
  SkyViewkeeperModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAffixModule,
    SkyAlertModule,
    SkyAppLinkModule,
    SkyCodeModule,
    SkyDefinitionListModule,
    SkyDockModule,
    SkyDocsToolsModule,
    SkyFluidGridModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyNumericModule,
    SkyOverlayModule,
    SkyPageModule,
    SkyViewkeeperModule
  ],
  entryComponents: [
    DockItemVisualComponent,
    DynamicComponentDemoExampleComponent,
    OverlayDemoExampleComponent
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-core',
        packageName: '@skyux/core'
      }
    }
  ]
})
export class AppExtrasModule { }
