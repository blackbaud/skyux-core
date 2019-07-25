import {
  Injectable
} from '@angular/core';

/**
 * @deprecated This feature will be dropped in the next major version release.
 */
@Injectable()
export class MutationObserverService {
  public create(callback: any): MutationObserver {
    return new MutationObserver(callback);
  }
}
