// #region imports
import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyMediaQueryService
} from './media-query.service';
// #endregion

@NgModule({
  providers: [
    SkyMediaQueryService
  ],
  imports: [
    CommonModule
  ]
})
export class SkyMediaQueryModule { }
