import {
  Injectable
} from '@angular/core';

/**
 * @deprecated This feature will be dropped in the next major version release.
 */
@Injectable()
export class SkyLogService {
  public warn(
    message?: any,
    ...optionalParams: any[]
  ): void {
    /*istanbul ignore else */
    if (window.console) {
      window.console.warn.apply(window.console, arguments);
    }
  }
}
