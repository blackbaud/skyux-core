import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  MutationObserverService
} from '../mutation';

import {
  SkyAffixer
} from './affixer';

@Injectable()
export class SkyAffixService {

  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    private observerService: MutationObserverService
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  /**
   * Creates an instance of [[SkyAffixer]].
   * @param affixed The element to be affixed.
   */
  public createAffixer(affixed: ElementRef): SkyAffixer {
    return new SkyAffixer(
      affixed.nativeElement,
      this.renderer,
      this.observerService
    );
  }

}
