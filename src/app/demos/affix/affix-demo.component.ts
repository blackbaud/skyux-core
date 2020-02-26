import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  SkyAffixHorizontalAlignment,
  SkyAffixPlacement,
  SkyAffixVerticalAlignment
} from '../../public';

@Component({
  selector: 'app-affix-demo',
  templateUrl: './affix-demo.component.html',
  styleUrls: ['./affix-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffixDemoComponent implements OnInit {

  public placement: SkyAffixPlacement;

  public horizontalAlignment: SkyAffixHorizontalAlignment;

  public verticalAlignment: SkyAffixVerticalAlignment;

  public isSticky: boolean = true;

  public enableScrollableParent: boolean = false;

  public disabled: boolean = false;

  private interval: any;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.runAffixCycle();
  }

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
    this.runAffixCycle();
  }

}
