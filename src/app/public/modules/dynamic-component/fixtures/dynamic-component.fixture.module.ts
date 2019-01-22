import {
  NgModule
} from '@angular/core';

import {
  SkyDynamicComponentModule
} from '../dynamic-component.module';

import {
  DynamicComponentTestComponent
} from './dynamic-component-test.component';

@NgModule({
  imports: [
    SkyDynamicComponentModule
  ],
  declarations: [
    DynamicComponentTestComponent
  ]
})
export class DynamicComponentTestModule { }
