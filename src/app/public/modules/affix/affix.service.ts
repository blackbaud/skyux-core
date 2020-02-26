import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyAffixer
} from './affixer';

@Injectable()
export class SkyAffixService {

  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public createAffixer(subject: ElementRef): SkyAffixer {
    return new SkyAffixer(
      subject.nativeElement,
      this.renderer
    );
  }

}
