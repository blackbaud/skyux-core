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
  fromEvent,
  Observable,
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayInstance
} from './overlay-instance';

@Component({
  selector: 'sky-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyOverlayComponent implements OnDestroy {

  /**
   * @internal
   */
  public get closed(): Observable<void> {
    return this._closed;
  }

  public allowClickThrough = false;

  public showBackdrop = false;

  @ViewChild('target', { read: ViewContainerRef })
  private targetRef: ViewContainerRef;

  private ngUnsubscribe = new Subject<void>();

  private _closed = new Subject<void>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private router: Router
  ) { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this._closed.complete();
  }

  public attach<T>(component: Type<T>, config: SkyOverlayConfig): SkyOverlayInstance<T> {
    this.showBackdrop = config.showBackdrop;
    this.allowClickThrough = (!this.showBackdrop && config.disableClose);
    this.changeDetector.markForCheck();

    return this.createOverlayInstance(component, config);
  }

  private createOverlayInstance<T>(component: Type<T>, config: SkyOverlayConfig) {
    const componentRef = this.createComponent(component, config.providers);
    const instance = new SkyOverlayInstance<T>();

    if (!config.disableClose) {
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
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          instance.close();
        }
      });
  }

  private applyBackdropClickListener<T>(instance: SkyOverlayInstance<T>): void {
    fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        instance.close();
      });
  }
}
