import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  MutationObserverService
} from '../mutation';

import {
  SkyAffixDirective
} from './affix.directive';

import {
  SkyAffixService
} from './affix.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    SkyAffixDirective
  ],
  declarations: [
    SkyAffixDirective
  ],
  providers: [
    MutationObserverService,
    SkyAffixService
  ]
})
export class SkyAffixModule { }
