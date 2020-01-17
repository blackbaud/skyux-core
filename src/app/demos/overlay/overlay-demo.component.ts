import {
  Component
} from '@angular/core';

import {
  SkyOverlayConfig,
  SkyOverlayInstance,
  SkyOverlayService
} from '../../public';

import {
  OverlayDemoExampleComponent
} from './overlay-demo-example.component';

@Component({
  selector: 'sky-overlay-demo',
  templateUrl: './overlay-demo.component.html'
})
export class OverlayDemoComponent {

  private overlayInstance: SkyOverlayInstance<OverlayDemoExampleComponent>;

  constructor(
    private overlayService: SkyOverlayService
  ) { }

  public launchDefaultOverlay(): void {
    this.overlayInstance = this.launchOverlay({});
  }

  public launchCustomOverlay(): void {
    this.overlayInstance = this.launchOverlay({
      closeOnNavigation: false,
      disableClose: false,
      disableScroll: true,
      showBackdrop: true
    });
  }

  private launchOverlay(
    config: SkyOverlayConfig
  ): SkyOverlayInstance<OverlayDemoExampleComponent> {
    if (this.overlayInstance) {
      this.overlayInstance.destroy();
    }

    const overlayInstance = this.overlayService.attach(
      OverlayDemoExampleComponent,
      config
    );

    overlayInstance.destroyed.subscribe(() => {
      console.log('The overlay instance was destroyed.');
    });

    // Manually close the overlay instance when a button is clicked in the attached component.
    overlayInstance.componentInstance.closeClicked.subscribe(() => {
      overlayInstance.destroy();
    });

    return overlayInstance;
  }
}
