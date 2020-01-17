import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  SkyAffixService,
  SkyOverlayConfig,
  SkyOverlayInstance,
  SkyOverlayService,
  SkyAffixConfig
} from '../../public';

import {
  OverlayDemoExampleComponent
} from './overlay-demo-example.component';

@Component({
  selector: 'sky-overlay-demo',
  templateUrl: './overlay-demo.component.html',
  styleUrls: ['./overlay-demo.component.scss'],
  providers: [
    SkyAffixService
  ]
})
export class OverlayDemoComponent implements OnInit {

  public affixOptions: SkyAffixConfig = { };

  public choices: {
    label: string;
    config: SkyAffixConfig
  }[] = [
    {
      label: 'Default',
      config: {}
    },
    {
      label: 'Above, left',
      config: {
        horizontalAlignment: 'left',
        placement: 'above'
      }
    },
    {
      label: 'Above, center',
      config: {
        horizontalAlignment: 'center',
        placement: 'above'
      }
    },
    {
      label: 'Above, right',
      config: {
        horizontalAlignment: 'right',
        placement: 'above'
      }
    },
    {
      label: 'Below, left',
      config: {
        horizontalAlignment: 'left',
        placement: 'below'
      }
    },
    {
      label: 'Below, center',
      config: {
        horizontalAlignment: 'center',
        placement: 'below'
      }
    },
    {
      label: 'Below, right',
      config: {
        horizontalAlignment: 'right',
        placement: 'below'
      }
    },
    {
      label: 'Left',
      config: {
        placement: 'left'
      }
    },
    {
      label: 'Right',
      config: {
        placement: 'right'
      }
    }
  ];

  @ViewChild('target')
  private target: ElementRef;

  private instance: SkyOverlayInstance<OverlayDemoExampleComponent>;

  constructor(
    private affixService: SkyAffixService,
    private overlayService: SkyOverlayService
  ) { }

  public ngOnInit(): void { }

  public compareFn(c1: SkyAffixConfig, c2: SkyAffixConfig): boolean {
    return (
      c1 &&
      c2 &&
      c1.horizontalAlignment === c2.horizontalAlignment &&
      c1.placement === c2.placement
    );
  }

  public launchDefaultOverlay(): void {
    this.instance = this.launchOverlay({});
  }

  public launchCustomOverlay(): void {
    this.instance = this.launchOverlay({
      destroyOnBackdropClick: true,
      keepAfterNavigationChange: true,
      preventBodyScroll: true,
      showBackdrop: true
    });
  }

  private launchOverlay(config: SkyOverlayConfig): SkyOverlayInstance<OverlayDemoExampleComponent> {
    if (this.instance) {
      this.instance.destroy();
    }

    const instance = this.overlayService.attach(OverlayDemoExampleComponent, config);

    instance.destroyed.subscribe(() => {
      console.log('Destroyed!');
    });

    instance.componentInstance.closeClicked.subscribe(() => {
      console.log('Close clicked!');
      instance.destroy();
    });

    const affixer = this.affixService.createAffixer(
      instance.componentInstance.elementRef
    );

    // Needs to be renamed.
    affixer.targetVisibility.subscribe((args) => {
      instance.componentInstance.isVisible = args.isVisible;
    });

    affixer.affixTo(this.target, this.affixOptions);

    return instance;
  }
}
