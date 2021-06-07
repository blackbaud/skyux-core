import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDynamicComponentModule
} from '../dynamic-component/dynamic-component.module';

import {
  SkyDockComponent
} from './dock.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDynamicComponentModule
  ],
  declarations: [
    SkyDockComponent
  ],
  entryComponents: [
    SkyDockComponent
  ]
})
export class SkyDockModule { }
