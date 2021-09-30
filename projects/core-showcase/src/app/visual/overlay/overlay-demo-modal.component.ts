import {
  Component,
  Optional
} from '@angular/core';

import {
  OverlayModalContext
} from './overlay-demo-modal-context';

@Component({
  selector: 'app-overlay-modal',
  template: `<sky-modal>
    <sky-modal-header>Overlay content ID: {{ contentId }}</sky-modal-header>
  </sky-modal>`
})
export class OverlayModalComponent {

  public contentId: string;

  constructor(
    @Optional() context: OverlayModalContext
  ) {
    this.contentId = (context) ? context.id : 'none';
  }

}
