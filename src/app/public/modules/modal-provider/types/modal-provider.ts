import {
  Subject
} from 'rxjs';

import {
  SkyModalProviderCloseArgs
} from './modal-provider-close-args';

export interface SkyModalProvider {

  type: string;
  open: Function;
  closeCallback: Subject<SkyModalProviderCloseArgs>;

}
