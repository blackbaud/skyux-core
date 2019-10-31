import {
  ComponentRef,
  Injectable,
  OnDestroy,
  Type
} from '@angular/core';

import { SkyDynamicComponentService } from '../dynamic-component';

import { SkyOverlayConfig } from './overlay-config';
import { SkyOverlayDomAdapterService } from './overlay-dom-adapter.service';
import { SkyOverlayHostComponent } from './overlay-host.component';
import { SkyOverlayInstance } from './overlay-instance';

@Injectable()
export class SkyOverlayService implements OnDestroy {

  private host: ComponentRef<SkyOverlayHostComponent>;

  private instances: SkyOverlayInstance<any>[] = [];

  constructor(
    private dynamicComponentService: SkyDynamicComponentService,
    private adapter: SkyOverlayDomAdapterService
  ) { }

  public ngOnDestroy(): void {
    this.removeHostComponent();
  }

  public attach<T>(
    component: Type<T>,
    config?: SkyOverlayConfig
  ): SkyOverlayInstance<T> {

    const defaults: SkyOverlayConfig = {
      destroyOnOverlayClick: true,
      keepAfterNavigationChange: false,
      preventBodyScroll: false,
      showBackdrop: false
    };

    const settings = Object.assign(defaults, config || {});

    this.ensureHostExists();

    if (settings.preventBodyScroll) {
      this.adapter.restrictBodyScroll();
    }

    const instance = this.host.instance.attach(component, settings);

    instance.destroyed.subscribe(() => {
      this.instances.splice(this.instances.indexOf(instance), 1);
      if (this.instances.length === 0) {
        this.removeHostComponent();
      }
    });

    this.instances.push(instance);

    return instance;
  }

  private createHostComponent(): ComponentRef<SkyOverlayHostComponent> {
    return this.dynamicComponentService.createComponent(SkyOverlayHostComponent);
  }

  private ensureHostExists(): ComponentRef<SkyOverlayHostComponent> {
    if (!this.host) {
      this.host = this.createHostComponent();
    }

    return this.host;
  }

  private removeHostComponent(): void {
    this.dynamicComponentService.removeComponent(this.host);
    this.host = undefined;
    this.adapter.releaseBodyScroll();
  }
}
