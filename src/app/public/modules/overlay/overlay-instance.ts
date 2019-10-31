import {
  EventEmitter
} from '@angular/core';

import {
  Observable
} from 'rxjs';

export class SkyOverlayInstance<T> {
  public componentInstance: T;

  // public get closed(): Observable<void> {
  //   return this._closed;
  // }

  // private _closed = new EventEmitter<void>();

  public get destroyed(): Observable<void> {
    return this._destroyed;
  }

  private _destroyed = new EventEmitter<void>();

  // public triggerBackdropClick(): void {
  //   this._backdropClick.next();
  // }

  // public close(): void {
  //   this._closed.next();
  //   this._closed.complete();
  // }

  public destroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
