import {
  AfterViewInit,
  Component,
  Host
} from '@angular/core';

import {
  SkyDockLocation,
  SkyDockService
} from 'projects/core/src/public-api';

import {
  DockItemVisualContext
} from './dock-item-context';

import {
  DockItemVisualComponent
} from './dock-item-visual.component';

@Component({
  selector: 'app-dock-visual-inner',
  templateUrl: './dock-visual-inner.component.html',
  styleUrls: ['./dock-visual.component.scss', './dock-visual-inner.component.scss'],
  providers: [SkyDockService]
})
export class DockVisualInnerComponent implements AfterViewInit {

  public stackOrder: number;

  private configs: any[] = [
    {
      stackOrder: 0,
      backgroundColor: 'darkred'
    },
    {
      stackOrder: 100,
      backgroundColor: 'darkmagenta'
    },
    {
      stackOrder: 10,
      backgroundColor: 'darkcyan'
    },
    {
      stackOrder: -1000,
      backgroundColor: 'darkblue'
    },
    {
      stackOrder: 1,
      backgroundColor: 'darkgreen'
    }
  ];

  constructor(
    @Host() private dockService: SkyDockService
  ) {}

  public ngAfterViewInit(): void {
    this.dockService.setDockOptions({
      location: SkyDockLocation.ElementBottom,
      referenceEl: document.querySelector('#dock-visual-inner')
    });
    this.configs.forEach((config) => {
      this.addToDock(config);
    });
  }

  public onAddItemClick(): void {
    this.addToDock({
      backgroundColor: 'tan',
      stackOrder: this.stackOrder
    });
  }

  private addToDock(config: any): void {
    const item = this.dockService.insertComponent(DockItemVisualComponent, {
      stackOrder: config.stackOrder,
      providers: [
        {
          provide: DockItemVisualContext,
          useValue: new DockItemVisualContext(
            config.backgroundColor,
            config.stackOrder
          )
        }
      ]
    });

    item.componentInstance.stackOrderForDisplay = item.stackOrder;

    item.destroyed.subscribe(() => {
      console.log('Dock item destroyed:', item.stackOrder);
    });

    item.componentInstance.closeClicked.subscribe(() => item.destroy());
  }
}
