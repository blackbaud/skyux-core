import {
  Component
} from '@angular/core';

import {
  SkyDockItem
} from '../dock-item';

import {
  SkyDockItemConfig
} from '../dock-item-config';

import {
  SkyDockService
} from '../dock.service';

import {
  DockItemFixtureComponent
} from './dock-item.component.fixture';
import { DockItemFixtureContext } from './dock-item-context.fixture';

@Component({
  selector: 'dock-test',
  template: ''
})
export class DockFixtureComponent {

  public set itemConfigs(value: {
    config: SkyDockItemConfig;
    dockHeight: number;
  }[]) {
    value.forEach(c => this.addItem(c.config, c.dockHeight));
  }

  public dockItems: SkyDockItem<DockItemFixtureComponent>[] = [];

  constructor(
    public dockService: SkyDockService
  ) { }

  public addItem(config: SkyDockItemConfig, dockHeight: number): void {
    this.dockItems.push(this.dockService.insertComponent(DockItemFixtureComponent, [{
      provide: DockItemFixtureContext,
      useValue: new DockItemFixtureContext({
        height: dockHeight
      })
    }], config));
  }

  public removeAllItems(): void {
    this.dockItems.forEach(i => i.destroy());
  }

}
