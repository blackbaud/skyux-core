import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  ComponentRef
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
export class SkyOverlayComponent implements OnInit, OnDestroy {

  /**
   * @internal
   */
  public get destroyed(): Observable<void> {
    return this._destroyed;
  }

  public allowClickThrough = false;

  public showBackdrop = false;

  @ViewChild('target', { read: ViewContainerRef })
  private targetRef: ViewContainerRef;

  private destroyOnBackdropClick = true;

  private instance: SkyOverlayInstance<any>;

  private ngUnsubscribe = new Subject<void>();

  private _destroyed = new Subject<void>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.addEventListeners();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this._destroyed.complete();
  }

  public attach<T>(component: Type<T>, config: SkyOverlayConfig): SkyOverlayInstance<T> {
    const instance = new SkyOverlayInstance<T>();

    const componentRef = this.createComponent(component, config);

    this.router.events
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          if (config.keepAfterNavigationChange) {
            config.keepAfterNavigationChange = false;
          } else {
            instance.destroy();
          }
        }
      });

    instance.componentInstance = componentRef.instance;

    instance.destroyed.subscribe(() => {
      componentRef.destroy();
      this._destroyed.next();
    });

    this.instance = instance;
    this.allowClickThrough = (!config.showBackdrop && !config.destroyOnBackdropClick);
    this.showBackdrop = config.showBackdrop;
    this.destroyOnBackdropClick = config.destroyOnBackdropClick;

    this.changeDetector.markForCheck();

    return instance;
  }

  private createComponent<T>(component: Type<T>, config: SkyOverlayConfig): ComponentRef<T> {
    const factory = this.resolver.resolveComponentFactory(component);

    const injector = Injector.create({
      providers: config.providers || [],
      parent: this.injector
    });

    return this.targetRef.createComponent(factory, undefined, injector);
  }

  private addEventListeners(): void {
    fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        if (this.destroyOnBackdropClick) {
          this.instance.destroy();
        }
      });
  }
}
