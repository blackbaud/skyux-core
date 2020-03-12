import {
  Component
} from '@angular/core';

import {
  SkyOverlayService
} from '../overlay.service';

@Component({
  selector: 'app-overlay-test',
  templateUrl: './overlay.component.fixture.html'
})
export class OverlayFixtureComponent {

  constructor(
    public overlayService: SkyOverlayService
  ) { }

}
