import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Injector,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayInstance
} from './overlay-instance';

import {
  SkyOverlayComponent
} from './overlay.component';

/**
 * @internal
 */
@Component({
  selector: 'sky-overlay-host',
  templateUrl: './overlay-host.component.html',
  styleUrls: ['./overlay-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyOverlayHostComponent {

  @ViewChild('target', { read: ViewContainerRef })
  private targetRef: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  public attach<T>(component: Type<T>, config: SkyOverlayConfig): SkyOverlayInstance<T> {
    const factory = this.resolver.resolveComponentFactory(SkyOverlayComponent);

    const injector = Injector.create({
      providers: config.providers,
      parent: this.injector
    });

    const componentRef = this.targetRef.createComponent(factory, undefined, injector);
    const instance = componentRef.instance.attach(component, config);

    componentRef.instance.closed
      .subscribe(() => {
        componentRef.destroy();
      });

    return instance;
  }
}
