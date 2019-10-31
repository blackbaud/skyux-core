import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyOverlayService
} from '../../public';

import {
  OverlayDemoExampleComponent
} from './overlay-demo-example.component';

@Component({
  selector: 'sky-overlay-demo',
  template: ``
})
export class OverlayDemoComponent implements OnInit {

  constructor(
    private overlayService: SkyOverlayService
  ) { }

  public ngOnInit(): void {
    this.overlayService.attach(OverlayDemoExampleComponent, {});
  }
}
