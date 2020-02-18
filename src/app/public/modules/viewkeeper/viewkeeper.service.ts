import {
  Injectable
} from '@angular/core';

import {
  SkyViewkeeper
} from './viewkeeper';
import { SkyViewkeeperOptions } from './viewkeeper-options';

@Injectable()
export class SkyViewkeeperService {

  private viewkeepers: SkyViewkeeper[] = [];

  public create(options: SkyViewkeeperOptions): SkyViewkeeper {
    const vk = new SkyViewkeeper(options);

    this.viewkeepers.push(vk);

    return vk;
  }

  public destroy(vk: SkyViewkeeper) {
    const index = this.viewkeepers.indexOf(vk);

    if (index >= 0) {
      this.viewkeepers.splice(index, 1);
    }

    vk.destroy();
  }

}
