import {
  Injectable,
  Optional
} from '@angular/core';

import {
  SkyViewkeeper
} from './viewkeeper';

import {
  SkyViewkeeperHostOptions
} from './viewkeeper-host-options';

import {
  SkyViewkeeperOptions
} from './viewkeeper-options';

@Injectable()
export class SkyViewkeeperService {

  constructor(@Optional() private hostOptions?: SkyViewkeeperHostOptions) { }

  public create(options: SkyViewkeeperOptions): SkyViewkeeper {
    options = Object.assign({}, this.hostOptions || {}, options);

    return new SkyViewkeeper(options);
  }

  public destroy(vk: SkyViewkeeper): void {
    vk.destroy();
  }

}
