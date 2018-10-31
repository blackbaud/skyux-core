// #region imports
import {
  Injectable
} from '@angular/core';
// #endregion

@Injectable()
export class MutationObserverService {
  public create(callback: any): MutationObserver {
    return new MutationObserver(callback);
  }
}
