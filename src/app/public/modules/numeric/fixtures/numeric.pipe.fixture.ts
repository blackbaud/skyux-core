import {
  registerLocaleData
} from '@angular/common';

import {
  Component
} from '@angular/core';

import localeEs from '@angular/common/locales/es';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Observable
} from 'rxjs';

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

  constructor() {
    registerLocaleData(localeEs, 'es');
  }

}
