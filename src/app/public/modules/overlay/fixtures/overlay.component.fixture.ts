import {
  Component
} from '@angular/core';

import { SkyOverlayService } from '../overlay.service';

import { SkyOverlayInstance } from '../overlay-instance';

import { OverlayContentFixtureComponent } from './overlay-content.component.fixture';
import { SkyOverlayConfig } from '../overlay-config';

@Component({
  selector: 'overlay-fixture',
  templateUrl: './overlay.component.fixture.html'
})
export class OverlayFixtureComponent {

  constructor(
    private overlayService: SkyOverlayService
  ) { }

  public launchOverlay(
    config?: SkyOverlayConfig
  ): SkyOverlayInstance<OverlayContentFixtureComponent> {
    return this.overlayService.launch(OverlayContentFixtureComponent, config);
  }

}
