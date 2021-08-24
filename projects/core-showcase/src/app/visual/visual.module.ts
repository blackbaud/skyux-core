import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  SkyDocsToolsModule
} from '@skyux/docs-tools';

import { SkyPageModule } from '@skyux/layout';

import {
  SkyAffixModule, SkyIdModule, SkyNumericModule, SkyViewkeeperModule
} from 'projects/core/src/public-api';

import { AffixDemoComponent } from './affix/affix-demo.component';
import { DockItemVisualComponent } from './dock/dock-item-visual.component';
import { DockVisualComponent } from './dock/dock-visual.component';
import { DynamicComponentDemoComponent } from './dynamic-component/dynamic-component.component';
import { SkyIdDemoComponent } from './id/id-demo.component';
import { SkyMediaQueryDemoComponent } from './media-query/media-query-demo.component';
import { SkyNumericDemoComponent } from './numeric/numeric-demo.component';
import { OverlayDemoComponent } from './overlay/overlay-demo.component';
import { ViewkeeperDemoComponent } from './viewkeeper/viewkeeper-demo.component';

import { OverlayDemoTemplateExampleComponent } from './overlay/overlay-demo-template-example.component';
import { VisualComponent } from './visual.component';

@NgModule({
  declarations: [
    AffixDemoComponent,
    VisualComponent,
    DockItemVisualComponent,
    DockVisualComponent,
    DynamicComponentDemoComponent,
    SkyIdDemoComponent,
    SkyMediaQueryDemoComponent,
    SkyNumericDemoComponent,
    OverlayDemoComponent,
    ViewkeeperDemoComponent,
    OverlayDemoTemplateExampleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SkyAffixModule,
    SkyDocsToolsModule,
    SkyIdModule,
    SkyNumericModule,
    SkyPageModule,
    SkyViewkeeperModule
  ],
})
export class VisualModule {}
