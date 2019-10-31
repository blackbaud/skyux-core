import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule
} from '@angular/router';

import { SkyAppWindowRef } from '../window';

import { SkyOverlayDomAdapterService } from './overlay-dom-adapter.service';
import { SkyOverlayHostComponent } from './overlay-host.component';
import { SkyOverlayComponent } from './overlay.component';
import { SkyOverlayService } from './overlay.service';

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
    SkyOverlayService,
    SkyAppWindowRef
  ]
})
export class SkyOverlayModule { }
