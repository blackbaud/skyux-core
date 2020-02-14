import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injector,
  OnDestroy,
  StaticProvider,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  NavigationStart,
  Router
} from '@angular/router';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/observable/fromEvent';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/takeUntil';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayInstance
} from './overlay-instance';

/**
 * @internal
 */
@Component({
  selector: 'sky-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyOverlayComponent implements OnDestroy {

  public get closed(): Observable<void> {
    return this._closed.asObservable();
  }

  public allowClickThrough = false;

  public showBackdrop = false;

  @ViewChild('target', { read: ViewContainerRef })
  private targetRef: ViewContainerRef;

  private ngUnsubscribe = new Subject<void>();

  private _closed = new Subject<void>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private elementRef: ElementRef,
    private injector: Injector,
    private router: Router
  ) { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this._closed.complete();
  }

  public attach<T>(component: Type<T>, config: SkyOverlayConfig): SkyOverlayInstance<T> {
    this.showBackdrop = config.showBackdrop;
    this.allowClickThrough = (!this.showBackdrop && !config.enableClose);
    this.changeDetector.markForCheck();

    return this.createOverlayInstance(component, config);
  }

  private createOverlayInstance<T>(
    component: Type<T>,
    config: SkyOverlayConfig
  ): SkyOverlayInstance<T> {

    const componentRef = this.createComponent(component, config.providers);
    const instance = new SkyOverlayInstance<T>(config);

    if (config.enableClose) {
      this.applyBackdropClickListener(instance);
    }

    if (config.closeOnNavigation) {
      this.applyRouteListener(instance);
    }

    instance.componentInstance = componentRef.instance;
    instance.closed.subscribe(() => {
      componentRef.destroy();
      this._closed.next();
    });

    return instance;
  }

  private createComponent<T>(component: Type<T>, providers: StaticProvider[]): ComponentRef<T> {
    const factory = this.resolver.resolveComponentFactory(component);
    const injector = Injector.create({
      providers: providers || [],
      parent: this.injector
    });

    return this.targetRef.createComponent(factory, undefined, injector);
  }

  private applyRouteListener<T>(instance: SkyOverlayInstance<T>): void {
    this.router.events
      .takeUntil(this.ngUnsubscribe)
      .subscribe(event => {
        /* istanbul ignore else */
        if (event instanceof NavigationStart) {
          instance.close();
        }
      });
  }

  private applyBackdropClickListener<T>(instance: SkyOverlayInstance<T>): void {
    Observable.fromEvent(this.elementRef.nativeElement, 'click')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        instance.close();
      });
  }
}
