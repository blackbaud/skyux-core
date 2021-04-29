import {
  Observable
} from 'rxjs';

import {
  SkyModalProviderCloseArgs
} from './modal-provider-close-args';

/**
 * A provider for a modal instance.
 */
export interface SkyModalProvider {

  /**
   * The type of provider.
   */
  type: string;

  /**
   * An event that the modal instance emits when it closes.
   */
  closed: Observable<SkyModalProviderCloseArgs>;

  /**
   * Events which are triggered from inside the modal which are then listened to by the consumer.
   */
  events?: { [key: string]: Observable<any> };

  /**
   * Opens the modal using the specified parameters.
   * @param paramObject An object of the parameters needed to open the modal.
   */
  open(paramObject?: any): any;

}
