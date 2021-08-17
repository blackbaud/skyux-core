import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffixDemoComponent } from './demos/affix/affix-demo.component';
import { DockVisualComponent } from './demos/dock/dock-visual.component';
import { SkyNumericDemoComponent } from './demos/numeric/numeric-demo.component';

const routes: Routes = [
  {
    path: 'demos/affix',
    component: AffixDemoComponent
  },
  {
    path: 'demos/dock',
    component: DockVisualComponent
  },
  {
    path: 'demos/numeric',
    component: SkyNumericDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
