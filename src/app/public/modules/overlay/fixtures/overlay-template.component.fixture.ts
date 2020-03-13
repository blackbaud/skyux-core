import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  SkyOverlayInstance
} from '../overlay-instance';

import {
  SkyOverlayService
} from '../overlay.service';

@Component({
  selector: 'app-overlay-template-test',
  templateUrl: './overlay-template.component.fixture.html'
})
export class OverlayTemplateFixtureComponent implements OnInit, OnDestroy {

  @ViewChild('myTemplate', {
    read: TemplateRef
  })
  public myTemplate: TemplateRef<any>;

  private overlay: SkyOverlayInstance;

  constructor(
    private overlayService: SkyOverlayService
  ) { }

  public ngOnInit(): void {
    // const overlay = this.overlayService.create();
    // overlay.attachTemplate(this.myTemplate, {
    //   $implicit: {
    //     id: 5
    //   }
    // });

    // this.overlay = overlay;
  }

  public ngOnDestroy(): void {
    // this.overlayService.destroy(this.overlay);
  }

}
