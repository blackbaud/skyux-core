import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  SkyAffixModule,
  SkyIdModule,
  SkyNumericModule,
  SkyViewkeeperModule
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
import { SkyE2eThemeSelectorModule } from '@skyux/e2e-client';
import { DockVisualBetweenComponent } from './dock/dock-visual-between.component';
import { DockVisualInnerComponent } from './dock/dock-visual-inner.component';

@NgModule({
  declarations: [
    AffixDemoComponent,
    VisualComponent,
    DockItemVisualComponent,
    DockVisualBetweenComponent,
    DockVisualComponent,
    DockVisualInnerComponent,
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
    SkyE2eThemeSelectorModule,
    SkyIdModule,
    SkyNumericModule,
    SkyViewkeeperModule
  ]
})
export class VisualModule {}
