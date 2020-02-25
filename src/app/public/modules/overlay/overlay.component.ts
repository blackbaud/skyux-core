import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  StaticProvider,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

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
  SkyOverlayContext
} from './overlay-context';

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
    private context: SkyOverlayContext
  ) { }

  public ngOnInit(): void {
    this.applyConfig(this.context.config);
    if (this.context.config.enableClose) {
      this.applyBackdropClickListener();
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this._closed.complete();
  }

  public attachComponent<C>(component: Type<C>, providers: StaticProvider[] = []): ComponentRef<C> {
    const factory = this.resolver.resolveComponentFactory(component);
    const injector = Injector.create({
      providers,
      parent: this.injector
    });

    return this.targetRef.createComponent(factory, undefined, injector);
  }

  public attachTemplate<T>(templateRef: TemplateRef<T>, context: T): void {
    this.targetRef.createEmbeddedView(templateRef, context);
  }

  private applyBackdropClickListener(): void {
    Observable.fromEvent(this.elementRef.nativeElement, 'click')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this._closed.next();
        this._closed.complete();
      });
  }

  private applyConfig(config: SkyOverlayConfig): void {
    this.showBackdrop = config.showBackdrop;
    this.allowClickThrough = (!this.showBackdrop && !config.enableClose);
    this.changeDetector.markForCheck();
  }
}
