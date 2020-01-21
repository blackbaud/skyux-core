import {
  EventEmitter
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyOverlayConfig
} from './overlay-config';

/**
 * Represents a new overlay instance. It is used to manage the "closed" state of the overlay,
 * and access any public members on the appended content component instance.
 */
export class SkyOverlayInstance<T> {

  /**
   * The instance of the appended content component.
   */
  public componentInstance: T;

  /**
   * Emits after the overlay is closed.
   */
  public get closed(): Observable<void> {
    return this._closed;
  }

  private _closed = new EventEmitter<void>();

  constructor(
    /**
     * The overlay's configuration.
     */
    public readonly config: SkyOverlayConfig
  ) { }

  /**
   * Closes the overlay.
   */
  public close(): void {
    this._closed.next();
    this._closed.complete();
  }
}
