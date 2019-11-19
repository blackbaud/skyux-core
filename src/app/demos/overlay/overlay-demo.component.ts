import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyOverlayService, SkyOverlayConfig
} from '../../public';

import {
  OverlayDemoExampleComponent
} from './overlay-demo-example.component';

import { SkyOverlayInstance } from '../../public/modules/overlay/overlay-instance';

@Component({
  selector: 'sky-overlay-demo',
  templateUrl: './overlay-demo.component.html'
})
export class OverlayDemoComponent implements OnInit {

  constructor(
    private overlayService: SkyOverlayService
  ) { }

  public ngOnInit(): void {
  }

  public launchOverlay1(): void {
    this.launchOverlay({
      destroyOnBackdropClick: true,
      showBackdrop: true,
      preventBodyScroll: true
    });
  }

  public launchOverlay2(): void {
    this.launchOverlay({
      destroyOnBackdropClick: false,
      showBackdrop: false,
      preventBodyScroll: false,
      keepAfterNavigationChange: true
    });
  }

  private launchOverlay(config: SkyOverlayConfig): SkyOverlayInstance<OverlayDemoExampleComponent> {
    const instance = this.overlayService.attach(OverlayDemoExampleComponent, config);

    instance.destroyed.subscribe(() => {
      console.log('Destroyed!');
    });

    instance.componentInstance.closeClicked.subscribe(() => {
      console.log('Close clicked!');
      instance.destroy();
    });

    return instance;
  }
}
