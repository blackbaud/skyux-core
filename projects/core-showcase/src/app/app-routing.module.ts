import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AffixDemoComponent } from './visual/affix/affix-demo.component';
import { VisualComponent } from './visual/visual.component';
import { DockVisualComponent } from './visual/dock/dock-visual.component';
import { DynamicComponentDemoComponent } from './visual/dynamic-component/dynamic-component.component';
import { SkyIdDemoComponent } from './visual/id/id-demo.component';
import { SkyMediaQueryDemoComponent } from './visual/media-query/media-query-demo.component';
import { SkyNumericDemoComponent } from './visual/numeric/numeric-demo.component';
import { OverlayDemoComponent } from './visual/overlay/overlay-demo.component';
import { ViewkeeperDemoComponent } from './visual/viewkeeper/viewkeeper-demo.component';

const routes: Routes = [
  {
    path: '',
    component: VisualComponent
  },
  {
    path: 'visual/affix',
    component: AffixDemoComponent
  },
  {
    path: 'visual/dock',
    component: DockVisualComponent
  },
  {
    path: 'visual/dynamic-component',
    component: DynamicComponentDemoComponent
  },
  {
    path: 'visual/id',
    component: SkyIdDemoComponent
  },
  {
    path: 'visual/media-query',
    component: SkyMediaQueryDemoComponent
  },
  {
    path: 'visual/numeric',
    component: SkyNumericDemoComponent
  },
  {
    path: 'visual/overlay',
    component: OverlayDemoComponent
  },
  {
    path: 'visual/viewkeeper',
    component: ViewkeeperDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
