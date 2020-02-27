import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyAffixHorizontalAlignment
} from './affix-horizontal-alignment';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  SkyAffixSubjectVisibilityChange
} from './affix-subject-visibility-change';

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
export class SkyAffixDirective implements OnChanges, OnDestroy {

  @Input()
  public skyAffixTo: HTMLElement;

  @Input()
  public affixEnableAutoFit: boolean;

  @Input()
  public affixPlacement: SkyAffixPlacement;

  @Input()
  public affixHorizontalAlignment: SkyAffixHorizontalAlignment;

  @Input()
  public affixVerticalAlignment: SkyAffixVerticalAlignment;

  @Input()
  public affixIsSticky: boolean;

  @Output()
  public affixSubjectVisibilityChange = new EventEmitter<SkyAffixSubjectVisibilityChange>();

  private affixer: SkyAffixer;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    elementRef: ElementRef,
    private affixService: SkyAffixService
  ) {
    this.affixer = this.affixService.createAffixer(elementRef);
    this.affixer.subjectVisibilityChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((change) => this.affixSubjectVisibilityChange.emit(change));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.affixPlacement ||
      changes.affixHorizontalAlignment ||
      changes.affixVerticalAlignment ||
      changes.affixIsSticky ||
      changes.affixEnableAutoFit
    ) {
      this.updateAlignment();
    }
  }

  public ngOnDestroy(): void {
    this.affixSubjectVisibilityChange.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private updateAlignment(): void {
    this.affixer.affixTo(this.skyAffixTo, {
      enableAutoFit: this.affixEnableAutoFit,
      horizontalAlignment: this.affixHorizontalAlignment,
      isSticky: this.affixIsSticky,
      placement: this.affixPlacement,
      verticalAlignment: this.affixVerticalAlignment
    });
  }

}
