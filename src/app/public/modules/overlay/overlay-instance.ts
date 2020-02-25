import {
  ComponentRef,
  StaticProvider,
  TemplateRef,
  Type
} from '@angular/core';

import {
  Observable,
  Subject
} from 'rxjs';

import {
  SkyOverlayComponent
} from './overlay.component';

import {
  SkyOverlayConfig
} from './overlay-config';

/**
 * Represents a new overlay instance. It is used to manage the "closed" state of the overlay,
 * and access any public members on the appended content component instance.
 */
export class SkyOverlayInstance {

  /**
   * Emits after the overlay is closed.
   */
  public get closed(): Observable<void> {
    return this._closed;
  }

  private _closed = new Subject<void>();

  constructor(
    /**
     * The overlay's configuration.
     */
    public readonly config: SkyOverlayConfig,
    private componentRef: ComponentRef<SkyOverlayComponent>
  ) {
    this.componentRef.instance.closed.subscribe(() => {
      this.close();
    });
  }

  public attachTemplate<T>(templateRef: TemplateRef<T>, context?: T): void {
    this.componentRef.instance.attachTemplate(templateRef, context);
  }

  public attachComponent<C>(component: Type<C>, providers?: StaticProvider[]): void {}

  /**
   * Closes the overlay.
   */
  public close(): void {
    this._closed.next();
    this._closed.complete();
  }

}
