import {
  EventEmitter
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  SkyModalProviderCloseArgs
} from './modal-provider-close-args';

export interface SkyModalProvider {

  type: string;
  closeCallback: Observable<SkyModalProviderCloseArgs>;
  events?: { [key: string]: EventEmitter<any> };
  open(paramObject?: any): any;

}
