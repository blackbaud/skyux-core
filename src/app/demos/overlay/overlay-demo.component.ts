import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  SkyAffixConfig,
  SkyAffixService,
  SkyOverlayConfig,
  SkyOverlayInstance,
  SkyOverlayService
} from '../../public';

import {
  OverlayDemoExampleComponent
} from './overlay-demo-example.component';

@Component({
  selector: 'sky-overlay-demo',
  templateUrl: './overlay-demo.component.html',
  providers: [
    SkyAffixService
  ]
})
export class OverlayDemoComponent implements OnInit {

  public affixOptions: SkyAffixConfig = {};

  public choices: {
    label: string;
    config: SkyAffixConfig
  }[] = [
    {
      label: 'Default',
      config: {}
    },
    {
      label: 'Left, Top',
      config: {
        horizontalAlignment: 'left',
        verticalAlignment: 'top'
      }
    },
    {
      label: 'Left, Middle',
      config: {
        horizontalAlignment: 'left',
        verticalAlignment: 'middle'
      }
    },
    {
      label: 'Left, Bottom',
      config: {
        horizontalAlignment: 'left',
        verticalAlignment: 'bottom'
      }
    },
    {
      label: 'Center, Top',
      config: {
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
      }
    },
    {
      label: 'Center, Middle',
      config: {
        horizontalAlignment: 'center',
        verticalAlignment: 'middle'
      }
    },
    {
      label: 'Center, Bottom',
      config: {
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom'
      }
    },
    {
      label: 'Right, Top',
      config: {
        horizontalAlignment: 'right',
        verticalAlignment: 'top'
      }
    },
    {
      label: 'Right, Middle',
      config: {
        horizontalAlignment: 'right',
        verticalAlignment: 'middle'
      }
    },
    {
      label: 'Right, Bottom',
      config: {
        horizontalAlignment: 'right',
        verticalAlignment: 'bottom'
      }
    }
  ];

  @ViewChild('target')
  private target: ElementRef;

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
      c1.verticalAlignment === c2.verticalAlignment
    );
  }

  public launchDefaultOverlay(): void {
    this.launchOverlay({});
  }

  public launchCustomOverlay(): void {
    this.launchOverlay({
      destroyOnBackdropClick: true,
      keepAfterNavigationChange: true,
      preventBodyScroll: true,
      showBackdrop: true
    });
  }

  private launchOverlay(config: SkyOverlayConfig): SkyOverlayInstance<OverlayDemoExampleComponent> {
    const instance = this.overlayService.attach(OverlayDemoExampleComponent, config);

    instance.destroyed.subscribe(() => {
      console.log('Destroyed!');
    });

    instance.componentInstance.closeClicked.subscribe(() => {
      console.log('Close clicked!');
      instance.destroy();
    });

    this.affixService.affixTo(
      instance.componentInstance.elementRef,
      this.target,
      Object.assign(
        {},
        {
          isSticky: true
        },
        this.affixOptions
      )
    );

    return instance;
  }
}
