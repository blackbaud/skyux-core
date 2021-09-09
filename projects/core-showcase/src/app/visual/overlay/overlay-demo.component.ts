import {
  Component
} from '@angular/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import {
  SkyOverlayConfig,
  SkyOverlayInstance,
  SkyOverlayService
} from 'projects/core/src/public-api';

import {
  OverlayDemoExampleContext
} from './overlay-demo-example-context';

import {
  OverlayDemoExampleComponent
} from './overlay-demo-example.component';
import { OverlayModalComponent } from './overlay-demo-modal.component';

let uniqueId = 0;

@Component({
  selector: 'app-overlay-demo',
  templateUrl: './overlay-demo.component.html'
})
export class OverlayDemoComponent {

  public overlays: SkyOverlayInstance[] = [];

  constructor(
    private modalService: SkyModalService,
    public overlayService: SkyOverlayService
  ) { }

  public createModal(): SkyModalInstance {
    return this.modalService.open(OverlayModalComponent);
  }

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
      enablePointerEvents: true,
      enableScroll: false,
      showBackdrop: true
    });
  }

  public closeAllOverlays(): void {
    this.overlayService.closeAll();
  }

  private createOverlay(config: SkyOverlayConfig): SkyOverlayInstance {
    const overlayInstance = this.overlayService.create(config);

    const componentInstance = overlayInstance.attachComponent(
      OverlayDemoExampleComponent,
      [{
        provide: OverlayDemoExampleContext,
        useValue: new OverlayDemoExampleContext(++uniqueId)
      }]
    );

    overlayInstance.backdropClick.subscribe(() => {
      console.log('Outside clicked.');
    });

    overlayInstance.closed.subscribe(() => {
      this.removeLocalInstance(overlayInstance);
    });

    // Manually close the overlay instance when a button is clicked in the attached component.
    componentInstance.closeClicked.subscribe(() => {
      this.overlayService.close(overlayInstance);
    });

    this.overlays.push(overlayInstance);

    return overlayInstance;
  }

  private removeLocalInstance(instance: SkyOverlayInstance): void {
    this.overlays.splice(this.overlays.indexOf(instance), 1);
  }
}
