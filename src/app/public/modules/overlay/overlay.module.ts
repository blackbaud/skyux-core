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
  SkyCoreAdapterModule
} from '../adapter-service/adapter.module';

import {
  SkyOverlayComponent
} from './overlay.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SkyCoreAdapterModule
  ],
  declarations: [
    SkyOverlayComponent
  ],
  entryComponents: [
    SkyOverlayComponent
  ]
})
export class SkyOverlayModule { }
