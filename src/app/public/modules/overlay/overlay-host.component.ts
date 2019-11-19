import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayInstance
} from './overlay-instance';

import {
  SkyOverlayComponent
} from './overlay.component';

@Component({
  selector: 'sky-overlay-host',
  templateUrl: './overlay-host.component.html',
  styleUrls: ['./overlay-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyOverlayHostComponent implements OnDestroy {

  @ViewChild('target', { read: ViewContainerRef })
  private targetRef: ViewContainerRef;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) { }

  public attach<T>(component: Type<T>, config: SkyOverlayConfig): SkyOverlayInstance<T> {

    const injector = Injector.create({
      providers: config.providers,
      parent: this.injector
    });

    const factory = this.resolver.resolveComponentFactory(SkyOverlayComponent);
    const componentRef = this.targetRef.createComponent(factory, undefined, injector);
    const instance = componentRef.instance.attach(component, config);

    componentRef.instance.destroyed.subscribe(() => {
      componentRef.destroy();
    });

    return instance;
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
