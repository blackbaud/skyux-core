import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  SkyAffixHorizontalAlignment,
  SkyAffixPlacement,
  SkyAffixSubjectVisibilityChange,
  SkyAffixVerticalAlignment
} from '../../public';

@Component({
  selector: 'app-affix-demo',
  templateUrl: './affix-demo.component.html',
  styleUrls: ['./affix-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffixDemoComponent {

  public placements: SkyAffixPlacement[] = ['above', 'right', 'below', 'left'];

  public horizontalAlignments: SkyAffixHorizontalAlignment[] = ['right', 'center', 'left'];

  public verticalAlignments: SkyAffixVerticalAlignment[] = ['bottom', 'middle', 'top'];

  public model: {
    placement: SkyAffixPlacement;
    horizontalAlignment?: SkyAffixHorizontalAlignment;
    verticalAlignment?: SkyAffixVerticalAlignment;
  } = {
    placement: 'above',
    horizontalAlignment: 'center',
    verticalAlignment: 'middle'
  };

  public isSticky: boolean = true;

  public enableAutoFit: boolean = true;

  public enableScrollableParent: boolean = false;

  public disabled: boolean = false;

  public isVisible: boolean = false;

  @ViewChild('parentScrollable', { read: ElementRef })
  private parentScrollable: ElementRef;

  @ViewChild('target', { read: ElementRef })
  private target: ElementRef;

  @ViewChild('toolbar', { read: ElementRef })
  private toolbar: ElementRef;

  private interval: any;

  private horizontalAlignmentIndex = 0;

  private placementIndex = 0;

  private verticalAlignmentIndex = 0;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public scrollToTarget(): void {
    const targetElement: HTMLDivElement = this.target.nativeElement;
    const top = targetElement.offsetTop;
    const left = targetElement.offsetLeft;

    if (this.enableScrollableParent) {
      const scrollable: HTMLDivElement = this.parentScrollable.nativeElement;
      scrollable.scrollTop = top -
        scrollable.offsetTop -
        (scrollable.clientHeight / 2) +
        (targetElement.clientHeight / 2);
      scrollable.scrollLeft = left -
        scrollable.offsetLeft -
        (scrollable.clientWidth / 2) +
        (targetElement.clientWidth / 2);
    } else {
      window.scroll(
        left -
          (document.documentElement.clientWidth / 2) +
          (targetElement.clientWidth / 2),
        top -
          (document.documentElement.clientHeight / 2) +
          (targetElement.clientHeight / 2) +
          (this.toolbar.nativeElement.clientHeight / 2)
      );
    }
  }

  public stepAffixCycle(): void {
    this.goToNext();
  }

  public runAffixCycle(): void {
    if (this.interval) {
      return;
    }

    this.disabled = true;
    this.changeDetector.markForCheck();

    this.interval = setInterval(() => {
      if (this.placementIndex === this.placements.length) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.disabled = false;
        this.changeDetector.markForCheck();
        return;
      }

      this.goToNext();
    }, 250);
  }

  public toggleScrollableParent(): void {
    this.enableScrollableParent = !this.enableScrollableParent;
    this.model.placement = 'below';
    this.changeDetector.markForCheck();
  }

  public onAffixSubjectVisibilityChange(change: SkyAffixSubjectVisibilityChange): void {
    this.isVisible = change.isVisible;
    this.changeDetector.detectChanges();
  }

  private goToNext(): void {
    if (this.placementIndex >= this.placements.length) {
      this.placementIndex = 0;
    }

    const placement = this.placements[this.placementIndex];
    this.model.placement = placement;
    this.changeDetector.markForCheck();

    if (placement === 'above' || placement === 'below') {
      this.model.horizontalAlignment = this.horizontalAlignments[this.horizontalAlignmentIndex];
      this.horizontalAlignmentIndex++;
      if (this.horizontalAlignmentIndex === this.horizontalAlignments.length) {
        this.placementIndex++;
        this.horizontalAlignmentIndex = 0;
        this.horizontalAlignments.reverse();
      }
    } else {
      this.model.verticalAlignment = this.verticalAlignments[this.verticalAlignmentIndex];
      this.verticalAlignmentIndex++;
      if (this.verticalAlignmentIndex === this.verticalAlignments.length) {
        this.placementIndex++;
        this.verticalAlignmentIndex = 0;
        this.verticalAlignments.reverse();
      }
    }

    this.changeDetector.markForCheck();
  }

}
