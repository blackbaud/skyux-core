import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyAffixer
} from './affixer';

import {
  SkyAppWindowRef
} from '../window';

/**
 * @internal
 */
@Injectable()
export class SkyAffixService {

  private renderer: Renderer2;

  constructor(
    private windowRef: SkyAppWindowRef,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public createAffixer(subject: ElementRef): SkyAffixer {
    this.renderer.setStyle(subject.nativeElement, 'position', 'fixed');
    return new SkyAffixer(subject, this.renderer, this.windowRef);
  }

}
