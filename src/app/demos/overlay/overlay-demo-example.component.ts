import {
  Component,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

@Component({
  selector: 'sky-overlay-child-demo',
  templateUrl: './overlay-demo-example.component.html'
})
export class OverlayDemoExampleComponent {

  public closeClicked = new Subject<void>();

  public set isVisible(value: boolean) {
    this._isVisible = value;
    this.changeDetector.markForCheck();
  }

  public get isVisible(): boolean {
    return this._isVisible || false;
  }

  private _isVisible: boolean = true;

  constructor(
    private changeDetector: ChangeDetectorRef,
    public elementRef: ElementRef
  ) { }

  public close(): void {
    this.closeClicked.next();
    this.closeClicked.complete();
  }
}
