import {
  ComponentRef,
  Injectable,
  OnDestroy,
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

@Injectable({
  providedIn: 'root'
})
export class SkyOverlayService implements OnDestroy {

  private host: ComponentRef<SkyOverlayHostComponent>;

  constructor(
    private dynamicComponentService: SkyDynamicComponentService,
    private adapter: SkyOverlayDomAdapterService
  ) {
    this.createHostComponent();
  }

  public ngOnDestroy(): void {
    this.adapter.releaseBodyScroll();
    this.removeHostComponent();
  }

  public attach<T>(
    component: Type<T>,
    config?: SkyOverlayConfig
  ): SkyOverlayInstance<T> {
    const defaults: SkyOverlayConfig = {
      disableClose: true,
      disableScroll: false,
      closeOnNavigation: true,
      showBackdrop: false
    };

    const settings = {...defaults, ...config};

    if (settings.disableScroll) {
      this.adapter.restrictBodyScroll();
    }

    const instance = this.host.instance.attach(component, settings);

    instance.destroyed.subscribe(() => {
      if (settings.disableScroll) {
        this.adapter.releaseBodyScroll();
      }
    });

    return instance;
  }

  private createHostComponent(): void {
    if (!this.host) {
      this.host = this.dynamicComponentService.createComponent(SkyOverlayHostComponent);
    }
  }

  private removeHostComponent(): void {
    this.dynamicComponentService.removeComponent(this.host);
    this.host = undefined;
  }

}
