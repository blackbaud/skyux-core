import {
  ComponentRef,
  Injectable,
  Type
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

  private instances: SkyOverlayInstance<any>[] = [];

  constructor(
    private dynamicComponentService: SkyDynamicComponentService,
    private adapter: SkyOverlayDomAdapterService
  ) {
    this.createHostComponent();
  }

  /**
   * Creates a new overlay and appends an instance of the provided component.
   * @param component The component to append to the overlay.
   * @param config The configuration for the overlay.
   */
  public create<T>(component: Type<T>, config?: SkyOverlayConfig): SkyOverlayInstance<T> {
    const defaults: SkyOverlayConfig = {
      closeOnNavigation: true,
      enableClose: false,
      enableScroll: true,
      showBackdrop: false
    };

    const settings = {...defaults, ...config};

    if (settings.enableScroll === false) {
      this.adapter.restrictBodyScroll();
    }

    const instance = this.host.instance.attach(component, settings);

    instance.closed.subscribe(() => {
      this.instances.splice(this.instances.indexOf(instance), 1);

      // Only release the body scroll if no other overlay wishes it to be disabled.
      if (settings.enableScroll === false) {
        const anotherInstanceDisablesScroll = this.instances.find(i => !i.config.enableScroll);
        if (!anotherInstanceDisablesScroll) {
          this.adapter.releaseBodyScroll();
        }
      }
    });

    this.instances.push(instance);

    return instance;
  }

  private createHostComponent(): void {
    this.host = this.dynamicComponentService.createComponent(SkyOverlayHostComponent);
  }

}
