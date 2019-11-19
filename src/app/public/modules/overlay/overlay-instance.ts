import {
  EventEmitter
} from '@angular/core';

import {
  Observable
} from 'rxjs';

export class SkyOverlayInstance<T> {
  public componentInstance: T;

  public get destroyed(): Observable<void> {
    return this._destroyed;
  }

  private _destroyed = new EventEmitter<void>();

  public destroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
