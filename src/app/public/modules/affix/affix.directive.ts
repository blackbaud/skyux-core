import {
  Directive,
  ElementRef,
  Input
} from '@angular/core';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  SkyAffixService
} from './affix.service';

import {
  SkyAffixer
} from './affixer';

@Directive({
  selector: '[skyAffixTo]'
})
export class SkyAffixDirective {

  @Input()
  public skyAffixTo: HTMLElement;

  @Input()
  public set affixPlacement(value: SkyAffixPlacement) {
    this._placement = value;
    this.updatePlacement();
  }

  public get affixPlacement(): SkyAffixPlacement {
    return this._placement || 'above';
  }

  private affixer: SkyAffixer;

  private _placement: SkyAffixPlacement;

  constructor(
    elementRef: ElementRef,
    private affixService: SkyAffixService
  ) {
    this.affixer = this.affixService.createAffixer(elementRef);
  }

  private updatePlacement(): void {
    this.affixer.affixTo(this.skyAffixTo, {
      placement: this.affixPlacement
    });
  }

}
