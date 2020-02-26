import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  SkyAffixHorizontalAlignment
} from './affix-horizontal-alignment';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  SkyAffixVerticalAlignment
} from './affix-vertical-alignment';

import {
  SkyAffixService
} from './affix.service';

import {
  SkyAffixer
} from './affixer';

@Directive({
  selector: '[skyAffixTo]'
})
export class SkyAffixDirective implements OnChanges {

  @Input()
  public skyAffixTo: HTMLElement;

  @Input()
  public affixPlacement: SkyAffixPlacement;

  @Input()
  public affixHorizontalAlignment: SkyAffixHorizontalAlignment;

  @Input()
  public affixVerticalAlignment: SkyAffixVerticalAlignment;

  @Input()
  public affixUpdateOnScroll: boolean;

  private affixer: SkyAffixer;

  constructor(
    elementRef: ElementRef,
    private affixService: SkyAffixService
  ) {
    this.affixer = this.affixService.createAffixer(elementRef);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.affixPlacement ||
      changes.affixHorizontalAlignment ||
      changes.affixVerticalAlignment
    ) {
      this.updateAlignment();
    }
  }

  private updateAlignment(): void {
    this.affixer.affixTo(this.skyAffixTo, {
      placement: this.affixPlacement,
      horizontalAlignment: this.affixHorizontalAlignment,
      updateOnScroll: this.affixUpdateOnScroll,
      verticalAlignment: this.affixVerticalAlignment
    });
  }

}
