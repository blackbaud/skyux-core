import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  SkyOverlayInstance,
  SkyOverlayService
} from '../../public';

@Component({
  selector: 'app-overlay-demo-self',
  templateUrl: './overlay-demo-self.component.html'
})
export class OverlayDemoSelfComponent implements AfterViewInit {

  @ViewChild('content', {
    read: TemplateRef
  })
  private contentTemplateRef: TemplateRef<any>;

  private overlay: SkyOverlayInstance;

  constructor(
    private overlayService: SkyOverlayService
  ) { }

  public ngAfterViewInit(): void {
    this.launchOverlay();
  }

  public onOpenClick(): void {
    this.launchOverlay();
  }

  public onCloseClick(): void {
    this.closeOverlay();
  }

  private launchOverlay(): void {
    const overlay = this.overlayService.create({
      closeOnNavigation: false,
      enableClose: true,
      enableScroll: false,
      showBackdrop: true
    });

    overlay.attachTemplate(
      this.contentTemplateRef, {
      $implicit: {
        foo: 'bar'
      }
    });

    this.overlay = overlay;
  }

  private closeOverlay(): void {
    this.overlay.close();
    this.overlay = undefined;
  }

}
