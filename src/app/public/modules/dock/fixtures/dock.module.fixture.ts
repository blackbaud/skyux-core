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
  SkyDockModule
} from '../dock.module';

import {
  DockItemFixtureComponent
} from './dock-item.component.fixture';

import {
  DockFixtureComponent
} from './dock.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    RouterTestingModule,
    SkyDockModule
  ],
  exports: [
    DockFixtureComponent,
    DockItemFixtureComponent
  ],
  declarations: [
    DockFixtureComponent,
    DockItemFixtureComponent
  ],
  entryComponents: [
    DockItemFixtureComponent
  ]
})
export class DockFixturesModule { }
