import {
  Injectable
} from '@angular/core';

import {
  of as observableOf,
  Observable
} from 'rxjs';

@Injectable()
export class SkyUIConfigService {

  public getConfig(
    key: string,
    defaultConfig?: any
  ): Observable<any> {
    return observableOf(defaultConfig);
  }

  /* istanbul ignore next */
  public setConfig(
    key: string,
    value: any
  ): Observable<any> {
    return observableOf({});
  }
}
