import {
  Component
} from '@angular/core';

import {
  SkyOverlayConfig,
  SkyOverlayInstance,
  SkyOverlayService
} from '../../public';

import {
  OverlayDemoExampleContext
} from './overlay-demo-example-context';

import {
  OverlayDemoExampleComponent
} from './overlay-demo-example.component';

let uniqueId = 0;

@Component({
  selector: 'sky-overlay-demo',
  templateUrl: './overlay-demo.component.html'
})
export class OverlayDemoComponent {

  public overlays: SkyOverlayInstance<OverlayDemoExampleComponent>[] = [];

  constructor(
    public overlayService: SkyOverlayService
  ) { }

  public onTestClick(): void {
    alert('Clicked! Is that a good thing?');
  }

  public launchDefaultOverlay(): void {
    this.createOverlay({});
  }

  public launchCustomOverlay(): void {
    this.createOverlay({
      closeOnNavigation: false,
      enableClose: true,
      enableScroll: false,
      showBackdrop: true
    });
  }

  public closeAllOverlays(): void {
    this.overlays.forEach(o => o.close());
  }

  private createOverlay(
    config: SkyOverlayConfig
  ): SkyOverlayInstance<OverlayDemoExampleComponent> {

    config.providers = [{
      provide: OverlayDemoExampleContext,
      useValue: new OverlayDemoExampleContext(++uniqueId)
    }];

    const overlayInstance = this.overlayService.create(
      OverlayDemoExampleComponent,
      config
    );

    overlayInstance.closed.subscribe(() => {
      setTimeout(() => {
        this.removeInstance(overlayInstance);
      });
    });

    // Manually close the overlay instance when a button is clicked in the attached component.
    overlayInstance.componentInstance.closeClicked.subscribe(() => {
      overlayInstance.close();
    });

    this.overlays.push(overlayInstance);

    return overlayInstance;
  }

  private removeInstance(instance: SkyOverlayInstance<OverlayDemoExampleComponent>): void {
    this.overlays.splice(this.overlays.indexOf(instance), 1);
  }
}
