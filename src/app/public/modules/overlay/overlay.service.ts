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

  public attach<T>(component: Type<T>, config?: SkyOverlayConfig): SkyOverlayInstance<T> {
    const defaults: SkyOverlayConfig = {
      destroyOnBackdropClick: false,
      keepAfterNavigationChange: false,
      preventBodyScroll: false,
      showBackdrop: false
    };

    const settings = Object.assign({}, defaults, config || {});

    if (settings.preventBodyScroll) {
      this.adapter.restrictBodyScroll();
    }

    return this.host.instance.attach(component, settings);
  }

  private createHostComponent(): void {
    this.host = this.dynamicComponentService.createComponent(SkyOverlayHostComponent);
  }

  private removeHostComponent(): void {
    this.dynamicComponentService.removeComponent(this.host);
    this.host = undefined;
  }

}
