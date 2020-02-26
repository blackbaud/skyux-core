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
  template: `
<div style="padding:250px;text-align:center;">
  <div class="target" style="width:50px;height:50px;" #target>
    <div class="target target-gap" style="width:40px;height:40px;">
      <div class="target" style="width:30px;height:30px;">
        <div class="target target-gap" style="width:20px;height:20px;">
          <div class="target" style="width:10px;height:10px;"></div>
        </div>
      </div>
    </div>
  </div>
  <div
    style="width:100px;height:100px;background-color:blue;position:fixed;"
    [skyAffixTo]="target"
    [affixPlacement]="placement"
    [affixHorizontalAlignment]="horizontalAlignment"
    [affixVerticalAlignment]="verticalAlignment"
  ></div>
  <div style="padding-top:150px;">
    <table style="text-align:left">
      <tr>
        <td>Placement:</td>
        <td>{{ placement }}</td>
      </tr>
      <tr>
        <td>Alignment:</td>
        <td *ngIf="placement === 'above' || placement === 'below'">{{ horizontalAlignment }}</td>
        <td *ngIf="placement === 'left' || placement === 'right'">{{ verticalAlignment }}</td>
      </tr>
    </table>
    <button
      class="sky-btn"
      type="button"
      [disabled]="disabled"
      (click)="runAffixCycle()"
    >
      Run affix cycle
    </button>
  </div>
</div>
`,
  styleUrls: ['./affix-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffixDemoComponent implements OnInit {

  public disabled: boolean = false;

  public horizontalAlignment: SkyAffixHorizontalAlignment;

  public placement: SkyAffixPlacement;

  public verticalAlignment: SkyAffixVerticalAlignment;

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

}
