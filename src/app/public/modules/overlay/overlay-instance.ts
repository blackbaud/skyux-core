import {
  EventEmitter
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

export class SkyOverlayInstance<T> {
  public componentInstance: T;

  public get closed(): Observable<void> {
    return this._closed;
  }

  private _closed = new EventEmitter<void>();

  public close(): void {
    this._closed.next();
    this._closed.complete();
  }
}
