import {
  ComponentRef,
  Injectable
} from '@angular/core';

import {
  SkyDynamicComponentService
} from '../dynamic-component';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayDomAdapterService
} from './overlay-dom-adapter.service';

import {
  SkyOverlayHostComponent
} from './overlay-host.component';

import {
  SkyOverlayInstance
} from './overlay-instance';

/**
 * This service is used to create new overlays.
 */
@Injectable()
export class SkyOverlayService {

  private host: ComponentRef<SkyOverlayHostComponent>;

  private overlays: SkyOverlayInstance[] = [];

  constructor(
    private dynamicComponentService: SkyDynamicComponentService,
    private adapter: SkyOverlayDomAdapterService
  ) {
    this.createHostComponent();
  }

  public create(config?: SkyOverlayConfig): SkyOverlayInstance {
    const settings = this.prepareConfig(config);
    if (settings.enableScroll === false) {
      this.adapter.restrictBodyScroll();
    }

    const componentRef = this.host.instance.createOverlay(settings);
    const overlayRef = new SkyOverlayInstance(
      settings,
      componentRef
    );

    overlayRef.closed.subscribe(() => {
      this.destroyOverlay(overlayRef);
      componentRef.destroy();
    });

    this.overlays.push(overlayRef);

    return overlayRef;
  }

  private createHostComponent(): void {
    this.host = this.dynamicComponentService.createComponent(SkyOverlayHostComponent);
  }

  private prepareConfig(config: SkyOverlayConfig): SkyOverlayConfig {
    const defaults: SkyOverlayConfig = {
      closeOnNavigation: true,
      enableClose: false,
      enableScroll: true,
      showBackdrop: false
    };

    return {...defaults, ...config};
  }

  private destroyOverlay(overlayRef: SkyOverlayInstance): void {
    if (overlayRef.config.enableScroll === false) {
      // Only release the body scroll if no other overlay wishes it to be disabled.
      const anotherOverlayDisablesScroll = this.overlays.some(o => !o.config.enableScroll);
      if (!anotherOverlayDisablesScroll) {
        this.adapter.releaseBodyScroll();
      }
    }

    this.overlays.splice(this.overlays.indexOf(overlayRef), 1);
  }

}
