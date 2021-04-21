import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyModalProviderService
} from './modal-provider.service';

@NgModule({
  providers: [
    SkyModalProviderService
  ],
  imports: [
    CommonModule
  ]
})
export class SkyModalProviderModule { }
