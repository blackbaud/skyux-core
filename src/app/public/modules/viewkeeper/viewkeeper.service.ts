import {
  Injectable
} from '@angular/core';

import {
  SkyViewkeeper
} from './viewkeeper';
import { SkyViewkeeperOptions } from './viewkeeper-options';

@Injectable()
export class SkyViewkeeperService {

  public create(options: SkyViewkeeperOptions): SkyViewkeeper {
    return new SkyViewkeeper(options);
  }

  public destroy(vk: SkyViewkeeper) {
    vk.destroy();
  }

}
