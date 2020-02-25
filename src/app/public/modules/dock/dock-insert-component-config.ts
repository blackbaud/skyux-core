import { SkyDockItemConfig } from './dock-item-config';
import { StaticProvider } from '@angular/core';

export interface SkyDockInsertComponentConfig extends SkyDockItemConfig {
  providers?: StaticProvider[];
}
