import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  SkyAppWindowRef
} from '../window/window-ref';

import {
  SkyOverlayDomAdapterService
} from './overlay-dom-adapter.service';

import {
  SkyOverlayHostComponent
} from './overlay-host.component';

import {
  SkyOverlayComponent
} from './overlay.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    SkyOverlayComponent,
    SkyOverlayHostComponent
  ],
  entryComponents: [
    SkyOverlayComponent,
    SkyOverlayHostComponent
  ],
  providers: [
    SkyOverlayDomAdapterService,
    SkyAppWindowRef
  ]
})
export class SkyOverlayModule { }
