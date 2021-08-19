import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AffixDemoComponent } from './demos/affix/affix-demo.component';
import { DemosComponent } from './demos/demos.component';
import { DockVisualComponent } from './demos/dock/dock-visual.component';
import { DynamicComponentDemoComponent } from './demos/dynamic-component/dynamic-component.component';
import { SkyIdDemoComponent } from './demos/id/id-demo.component';
import { SkyMediaQueryDemoComponent } from './demos/media-query/media-query-demo.component';
import { SkyNumericDemoComponent } from './demos/numeric/numeric-demo.component';
import { OverlayDemoComponent } from './demos/overlay/overlay-demo.component';
import { ViewkeeperDemoComponent } from './demos/viewkeeper/viewkeeper-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DemosComponent
  },
  {
    path: 'demos/affix',
    component: AffixDemoComponent
  },
  {
    path: 'demos/dock',
    component: DockVisualComponent
  },
  {
    path: 'demos/dynamic-component',
    component: DynamicComponentDemoComponent
  },
  {
    path: 'demos/id',
    component: SkyIdDemoComponent
  },
  {
    path: 'demos/media-query',
    component: SkyMediaQueryDemoComponent
  },
  {
    path: 'demos/numeric',
    component: SkyNumericDemoComponent
  },
  {
    path: 'demos/overlay',
    component: OverlayDemoComponent
  },
  {
    path: 'demos/viewkeeper',
    component: ViewkeeperDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
