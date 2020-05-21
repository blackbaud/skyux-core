import {
  Component
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/of';

class MockLocaleProvider extends SkyAppLocaleProvider {
  public getLocaleInfo() {
    return Observable.of({
      locale: 'es'
    });
  }
}

@Component({
  selector: 'numeric-pipe-fixture',
  templateUrl: './numeric.pipe.fixture.html',
  providers: [
    { provide: SkyAppLocaleProvider, useClass: MockLocaleProvider }
  ]
})
export class NumericPipeFixtureComponent {

  public locale: string;

}
