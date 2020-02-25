import {
  ComponentRef,
  Injectable
} from '@angular/core';

import {
  NavigationStart,
  Router
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  SkyDynamicComponentService
} from '../dynamic-component';

import {
  SkyOverlayAdapterService
} from './overlay-adapter.service';

import {
  SkyOverlayConfig
} from './overlay-config';

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

  private routerSubscription: Subscription;

  constructor(
    private dynamicComponentService: SkyDynamicComponentService,
    private router: Router,
    private adapter: SkyOverlayAdapterService
  ) {
    this.createHostComponent();
  }

  /**
   * Creates a new overlay.
   * @param config Configuration for the overlay.
   */
  public create(config?: SkyOverlayConfig): SkyOverlayInstance {
    const settings = this.prepareConfig(config);

    if (settings.enableScroll === false) {
      this.adapter.restrictBodyScroll();
    }

    if (settings.closeOnNavigation) {
      this.applyRouteListener();
    }

    const componentRef = this.host.instance.createOverlay(settings);
    const instance = new SkyOverlayInstance(
      settings,
      componentRef
    );

    instance.closed.subscribe(() => {
      this.destroyOverlay(instance);
      componentRef.destroy();
    });

    this.overlays.push(instance);

    return instance;
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

  private destroyOverlay(instance: SkyOverlayInstance): void {
    this.overlays.splice(this.overlays.indexOf(instance), 1);

    if (this.overlays.length === 0 && this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = undefined;
    }

    if (instance.config.enableScroll === false) {
      // Only release the body scroll if no other overlay wishes it to be disabled.
      const anotherOverlayDisablesScroll = this.overlays.some(o => !o.config.enableScroll);
      if (!anotherOverlayDisablesScroll) {
        this.adapter.releaseBodyScroll();
      }
    }
  }

  private applyRouteListener(): void {
    if (this.routerSubscription) {
      return;
    }

    this.routerSubscription = this.router.events.subscribe(event => {
      /* istanbul ignore else */
      if (event instanceof NavigationStart) {
        this.overlays.forEach(overlay => {
          /* istanbul ignore else */
          if (overlay.config.closeOnNavigation) {
            overlay.close();
          }
        });
      }
    });
  }

}
