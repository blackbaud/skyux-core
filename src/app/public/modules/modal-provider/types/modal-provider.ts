import {
  SkyCoreModalInstance
} from './modal-instance';

import {
  SkyCoreModalProviderOpenArgs
} from './modal-provider-open-args';

/**
 * A provider for a modal instance.
 */
export interface SkyCoreModalProvider {

  /**
   * The type of provider.
   */
  type: string;

  /**
   * Opens the modal using the specified parameters.
   * @param paramObject An object of the parameters needed to open the modal.
   */
  open(paramObject?: SkyCoreModalProviderOpenArgs): SkyCoreModalInstance;

}
