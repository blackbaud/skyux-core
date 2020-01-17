import {
  Component, Optional
} from '@angular/core';

import {
  OverlayFixtureContext
} from './overlay-context.fixture';

@Component({
  selector: 'overlay-fixture',
  templateUrl: './overlay.component.fixture.html'
})
export class OverlayFixtureComponent {

  constructor(
    @Optional() public readonly context: OverlayFixtureContext
  ) { }

}
