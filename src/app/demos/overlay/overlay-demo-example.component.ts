import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'sky-overlay-child-demo',
  template: `<h1>This is the overlay content.</h1>`
})
export class OverlayDemoExampleComponent implements OnInit {
  public ngOnInit(): void {
  }
}
