import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  SkyAffixHorizontalAlignment
} from '../affix-horizontal-alignment';

import {
  SkyAffixPlacement
} from '../affix-placement';

import {
  SkyAffixSubjectVisibilityChange
} from '../affix-subject-visibility-change';

import {
  SkyAffixVerticalAlignment
} from '../affix-vertical-alignment';

import {
  SkyAffixDirective
} from '../affix.directive';

@Component({
  selector: 'affix-test',
  templateUrl: './affix.component.fixture.html',
  styleUrls: ['./affix.component.fixture.scss']
})
export class AffixFixtureComponent {

  // #region directive properties

  public enableAutoFit: boolean;

  public horizontalAlignment: SkyAffixHorizontalAlignment;

  public isSticky: boolean;

  public placement: SkyAffixPlacement;

  public verticalAlignment: SkyAffixVerticalAlignment;

  // #endregion

  @ViewChild('subject', {
    read: ElementRef
  })
  public subjectElement: ElementRef;

  @ViewChild(SkyAffixDirective, {
    read: SkyAffixDirective
  })
  public affixDirective: SkyAffixDirective;

  @ViewChild('scrollableParent', {
    read: ElementRef
  })
  public scrollableParent: ElementRef;

  @ViewChild('target', {
    read: ElementRef
  })
  public targetElement: ElementRef;

  public enableScrollableParent: boolean = false;

  public onAffixSubjectVisibilityChange(change: SkyAffixSubjectVisibilityChange): void { }

  public scrollTargetToLeft(offset: number = 0): void {
    const target: HTMLDivElement = this.targetElement.nativeElement;
    const scrollable: HTMLDivElement = this.scrollableParent.nativeElement;
    scrollable.scroll(
      target.offsetLeft - offset,
      this.getParentCenterY()
    );
  }

  public scrollTargetToRight(offset: number = 0): void {
    const target: HTMLDivElement = this.targetElement.nativeElement;
    const scrollable: HTMLDivElement = this.scrollableParent.nativeElement;
    scrollable.scroll(
      target.offsetLeft - scrollable.clientWidth - offset,
      this.getParentCenterY()
    );
  }

  public scrollTargetToTop(offset: number = 0): void {
    const targetElement: HTMLDivElement = this.targetElement.nativeElement;
    const top = targetElement.offsetTop;
    const scrollable: HTMLDivElement = this.scrollableParent.nativeElement;
    scrollable.scroll(
      this.getParentCenterX(),
      top - offset
    );
  }

  public scrollTargetToBottom(offset: number = 0): void {
    const target: HTMLDivElement = this.targetElement.nativeElement;
    const top = target.offsetTop;
    const scrollable: HTMLDivElement = this.scrollableParent.nativeElement;
    scrollable.scroll(
      this.getParentCenterX(),
      top - scrollable.clientHeight - offset
    );
  }

  private getParentCenterX(): number {
    const scrollable: HTMLDivElement = this.scrollableParent.nativeElement;
    const target: HTMLDivElement = this.targetElement.nativeElement;
    return target.offsetLeft -
      scrollable.offsetLeft -
      (scrollable.clientWidth / 2) +
      (target.clientWidth / 2);
  }

  private getParentCenterY(): number {
    const scrollable: HTMLDivElement = this.scrollableParent.nativeElement;
    const target: HTMLDivElement = this.targetElement.nativeElement;
    return target.offsetTop -
      scrollable.offsetTop -
      (scrollable.clientHeight / 2) +
      (target.clientHeight / 2);
  }

}
