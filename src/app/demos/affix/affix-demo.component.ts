import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
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

  public placement: SkyAffixPlacement = 'above';

  public horizontalAlignment: SkyAffixHorizontalAlignment;

  public verticalAlignment: SkyAffixVerticalAlignment;

  public isSticky: boolean = true;

  public enableAutoFit: boolean = true;

  public enableScrollableParent: boolean = false;

  public disabled: boolean = false;

  public isVisible: boolean = false;

  private interval: any;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public runAffixCycle(): void {
    if (this.interval) {
      return;
    }

    this.disabled = true;
    this.changeDetector.markForCheck();

    const placements: SkyAffixPlacement[] = ['above', 'right', 'below', 'left'];
    const horizontalAlignments: SkyAffixHorizontalAlignment[] = ['right', 'center', 'left'];
    const verticalAlignments: SkyAffixVerticalAlignment[] = ['bottom', 'middle', 'top'];

    let placementIndex = 0;
    let horizontalAlignmentIndex = 0;
    let verticalAlignmentIndex = 0;

    this.interval = setInterval(() => {
      if (placementIndex === placements.length) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.disabled = false;
        this.changeDetector.markForCheck();
        return;
      }

      const placement = placements[placementIndex];
      this.placement = placement;

      if (placement === 'above' || placement === 'below') {
        this.horizontalAlignment = horizontalAlignments[horizontalAlignmentIndex];
        horizontalAlignmentIndex++;
        if (horizontalAlignmentIndex === horizontalAlignments.length) {
          placementIndex++;
          horizontalAlignmentIndex = 0;
          horizontalAlignments.reverse();
        }
      } else {
        this.verticalAlignment = verticalAlignments[verticalAlignmentIndex];
        verticalAlignmentIndex++;
        if (verticalAlignmentIndex === verticalAlignments.length) {
          placementIndex++;
          verticalAlignmentIndex = 0;
          verticalAlignments.reverse();
        }
      }

      this.changeDetector.markForCheck();
    }, 250);
  }

  public toggleScrollableParent(): void {
    this.enableScrollableParent = !this.enableScrollableParent;
    this.placement = 'below';
    this.changeDetector.markForCheck();
  }

  public onAffixSubjectVisibilityChange(change: SkyAffixSubjectVisibilityChange): void {
    this.isVisible = change.isVisible;
    this.changeDetector.detectChanges();
  }

}
