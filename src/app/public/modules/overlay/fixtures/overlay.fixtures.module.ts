import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyOverlayModule
} from '../overlay.module';

import {
  OverlayFixtureComponent
} from './overlay.component.fixture';
import { OverlayContentFixtureComponent } from './overlay-content.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    RouterTestingModule,
    SkyOverlayModule
  ],
  exports: [
    OverlayFixtureComponent
  ],
  declarations: [
    OverlayContentFixtureComponent,
    OverlayFixtureComponent
  ],
  entryComponents: [
    OverlayContentFixtureComponent
  ]
})
export class OverlayFixturesModule { }
