import {
  Component,
  ElementRef
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  OverlayDemoExampleContext
} from './overlay-demo-example-context';

@Component({
  selector: 'app-overlay-demo-example',
  templateUrl: './overlay-demo-example.component.html',
  styleUrls: ['./overlay-demo-example.component.scss']
})
export class OverlayDemoExampleComponent {

  public closeClicked = new Subject<void>();

  constructor(
    public context: OverlayDemoExampleContext,
    public elementRef: ElementRef
  ) { }

  public close(): void {
    this.closeClicked.next();
    this.closeClicked.complete();
  }
}
