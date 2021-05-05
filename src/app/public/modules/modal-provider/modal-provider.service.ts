import {
  Inject,
  Injectable,
  Optional
} from '@angular/core';

import {
  SkyCoreModalProvider
} from './types/modal-provider';

import {
  SKY_CORE_MODAL_PROVIDER
} from './types/modal-provider-injection-token';

@Injectable({
  providedIn: 'root'
})
export class SkyCoreModalProviderService {

  constructor(
    @Inject(SKY_CORE_MODAL_PROVIDER) @Optional() private modalProviders?: SkyCoreModalProvider[]
  ) {
  }

  public getModalForType(type: string): SkyCoreModalProvider {
    return this.modalProviders?.find(provider => provider.type === type);
  }
}
