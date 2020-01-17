import {
  EventEmitter
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyOverlayConfig
} from './overlay-config';

export class SkyOverlayInstance<T> {
  public componentInstance: T;

  public get closed(): Observable<void> {
    return this._closed;
  }

  private _closed = new EventEmitter<void>();

  constructor(
    public readonly config: SkyOverlayConfig
  ) { }

  public close(): void {
    this._closed.next();
    this._closed.complete();
  }
}
