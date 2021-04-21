import {
  Inject,
  Injectable,
  Optional
} from '@angular/core';

import {
  SkyModalProvider
} from './types/modal-provider';

import {
  SKY_MODAL_PROVIDER
} from './types/modal-provider-injection-token';

@Injectable()
export class SkyModalProviderService {

  constructor(
    @Inject(SKY_MODAL_PROVIDER) @Optional() private modalProviders?: SkyModalProvider[]
  ) {
  }

  public getModalForType(type: string): SkyModalProvider {
    return this.modalProviders?.find(provider => provider.type === type);
  }
}
