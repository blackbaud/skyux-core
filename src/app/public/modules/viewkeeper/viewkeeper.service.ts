import {
  Injectable,
  Optional
} from '@angular/core';

import {
  SkyViewkeeper
} from './viewkeeper';

import {
  SkyViewkeeperGlobalOptions
} from './viewkeeper-global-options';

import {
  SkyViewkeeperOptions
} from './viewkeeper-options';

@Injectable()
export class SkyViewkeeperService {

  constructor(@Optional() private globalOptions?: SkyViewkeeperGlobalOptions) { }

  public create(options: SkyViewkeeperOptions): SkyViewkeeper {
    options = Object.assign({}, this.globalOptions || {}, options);

    return new SkyViewkeeper(options);
  }

  public destroy(vk: SkyViewkeeper): void {
    vk.destroy();
  }

}
