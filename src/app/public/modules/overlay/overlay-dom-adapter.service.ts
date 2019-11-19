
import {
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyAppWindowRef
} from '../window/window-ref';

@Injectable()
export class SkyOverlayDomAdapterService {

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private windowRef: SkyAppWindowRef
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public restrictBodyScroll(): void {
    this.renderer.setStyle(
      this.windowRef.nativeWindow.document.body,
      'overflow',
      'hidden'
    );
  }

  public releaseBodyScroll(): void {
    this.renderer.removeStyle(
      this.windowRef.nativeWindow.document.body,
      'overflow'
    );
  }
}
