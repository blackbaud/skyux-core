import {
  Component,
  Optional
} from '@angular/core';

import {
  OverlayFixtureContext
} from './overlay-context.fixture';

@Component({
  selector: 'sky-overlay-entry-test',
  template: `
    <sky-modal>
      <sky-modal-header>
        Overlay content ID: {{ contentId }}
      </sky-modal-header>
    </sky-modal>
  `
})
export class OverlayEntryFixtureComponent {

  public contentId: string;

  constructor(
    @Optional() context: OverlayFixtureContext
  ) {
    this.contentId = (context) ? context.id : 'none';
  }

}
