// #region imports
import {
  Injectable
} from '@angular/core';
// #endregion

@Injectable()
export class SkyWindowRefService {
  public getWindow(): Window {
    return window;
  }
}
