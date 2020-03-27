import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  StaticProvider,
  TemplateRef,
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

import {
  Subscription
} from 'rxjs/Subscription';

import 'rxjs/add/observable/fromEvent';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/takeUntil';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayContext
} from './overlay-context';
import { SkyCoreAdapterService } from '../adapter-service';

let uniqueZIndex = 1001; // Omnibar is 1000

/**
 * @internal
 */
@Component({
  selector: 'sky-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyOverlayComponent implements OnInit, OnDestroy {

  public get outsideClick(): Observable<void> {
    return this._outsideClick.asObservable();
  }

  public get closed(): Observable<void> {
    return this._closed.asObservable();
  }

  public enablePointerEvents = true;

  public showBackdrop = false;

  public zIndex: string = `${++uniqueZIndex}`;

  @ViewChild('overlayContentRef', { read: ElementRef })
  private overlayContentRef: ElementRef;

  @ViewChild('overlayRef', { read: ElementRef })
  private overlayRef: ElementRef;

  @ViewChild('target', { read: ViewContainerRef })
  private targetRef: ViewContainerRef;

  private ngUnsubscribe = new Subject<void>();

  private routerSubscription: Subscription;

  private _outsideClick = new Subject<void>();

  private _closed = new Subject<void>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private coreAdapter: SkyCoreAdapterService,
    private context: SkyOverlayContext,
    @Optional() private router?: Router
  ) { }

  public ngOnInit(): void {
    this.applyConfig(this.context.config);

    setTimeout(() => {
      this.addBackdropClickListener();
    });

    if (this.context.config.closeOnNavigation) {
      this.addRouteListener();
    }
  }

  public ngOnDestroy(): void {
    this.removeRouteListener();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this._outsideClick.complete();
    this._closed.complete();

    this._outsideClick =
      this._closed =
      this.ngUnsubscribe = undefined;
  }

  public attachComponent<C>(component: Type<C>, providers: StaticProvider[] = []): ComponentRef<C> {
    this.targetRef.clear();

    const factory = this.resolver.resolveComponentFactory(component);
    const injector = Injector.create({
      providers,
      parent: this.injector
    });

    const instance = this.targetRef.createComponent(factory, undefined, injector);

    this.changeDetector.markForCheck();

    return instance;
  }

  public attachTemplate<T>(templateRef: TemplateRef<T>, context: T): EmbeddedViewRef<T> {
    this.targetRef.clear();

    const embeddedView = this.targetRef.createEmbeddedView(templateRef, context);

    this.changeDetector.markForCheck();

    return embeddedView;
  }

  private applyConfig(config: SkyOverlayConfig): void {
    this.showBackdrop = config.showBackdrop;
    this.enablePointerEvents = config.enablePointerEvents;
    this.changeDetector.markForCheck();
  }

  private addBackdropClickListener(): void {
    Observable.fromEvent(window.document, 'click')
      .takeUntil(this.ngUnsubscribe)
      .subscribe((event: MouseEvent) => {
        const isChild = this.overlayContentRef.nativeElement.contains(event.target);
        const isAbove = this.coreAdapter.isTargetLayerAboveElement(event.target, this.overlayRef);
        /* istanbul ignore else */
        if (!isChild && !isAbove) {
          this._outsideClick.next();
          if (this.context.config.enableClose) {
            this._closed.next();
          }
        }
      });
  }

  private addRouteListener(): void {
    /*istanbul ignore else*/
    if (this.router) {
      this.routerSubscription = this.router.events.subscribe(event => {
        /* istanbul ignore else */
        if (event instanceof NavigationStart) {
          this._closed.next();
          this._closed.complete();
        }
      });
    }
  }

  private removeRouteListener(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = undefined;
    }
  }
}
