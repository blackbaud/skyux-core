import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SkyAffixModule, SkyIdModule, SkyNumericModule, SkyViewkeeperModule } from "projects/core/src/public-api";
import { AffixDemoComponent } from "./affix/affix-demo.component";
import { DockItemVisualComponent } from "./dock/dock-item-visual.component";
import { DockVisualComponent } from "./dock/dock-visual.component";
import { DynamicComponentDemoComponent } from "./dynamic-component/dynamic-component.component";
import { SkyIdDemoComponent } from "./id/id-demo.component";
import { SkyMediaQueryDemoComponent } from "./media-query/media-query-demo.component";
import { SkyNumericDemoComponent } from "./numeric/numeric-demo.component";
import { OverlayDemoComponent } from "./overlay/overlay-demo.component";
import { ViewkeeperDemoComponent } from "./viewkeeper/viewkeeper-demo.component";

import {
  SkyDocsToolsModule
} from '@skyux/docs-tools';
import { FormsModule } from "@angular/forms";
import { SkyPageModule } from "@skyux/layout";
import { OverlayDemoTemplateExampleComponent } from "./overlay/overlay-demo-template-example.component";

@NgModule({
  declarations: [
    AffixDemoComponent,
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
    SkyAffixModule,
    SkyIdModule,
    SkyNumericModule,
    SkyPageModule,
    SkyViewkeeperModule,
    SkyDocsToolsModule
  ],
})
export class DemosModule {}
