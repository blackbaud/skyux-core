import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  SkyAffixPlacement
} from '../../public';

@Component({
  selector: 'app-affix-demo',
  template: `
<div style="padding:250px;text-align:center;">
  <div style="width:50px;height:50px;background-color:red;border-radius:50%;" #target></div>
  <div
    style="width:100px;height:100px;background-color:blue;position:fixed;"
    [skyAffixTo]="target"
    [affixPlacement]="placement"
  ></div>
  <button
    class="sky-btn"
    type="button"
    [disabled]="disabled"
    (click)="runAffixCycle()"
  >
    Run affix cycle
  </button>
</div>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffixDemoComponent implements OnInit {

  public disabled: boolean = false;

  public placement: SkyAffixPlacement;

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

    let index = 0;
    this.interval = setInterval(() => {
      if (index === placements.length) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.disabled = false;
        this.changeDetector.markForCheck();
        return;
      }

      this.placement = placements[++index];
      this.changeDetector.markForCheck();
    }, 500);
  }

}
