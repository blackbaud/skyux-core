import {
  ComponentRef,
  Injectable,
  Type,
  TemplateRef,
  StaticProvider
} from '@angular/core';

import {
  SkyDynamicComponentService
} from '@skyux/core';

import {
  SkyDockItem
} from './dock-item';

import {
  SkyDockComponent
} from './dock.component';

import {
  SkyDockItemConfig
} from './dock-item-config';

import {
  sortByStackOrder
} from './sort-by-stack-order';

/**
 * This service docks components to specific areas on the page.
 */
@Injectable()
export class SkyDockService {

  /**
   * Returns all docked items.
   */
  public get items(): SkyDockItem<any>[] {
    return this._items;
  }

  private dockRef: ComponentRef<SkyDockComponent>;

  private _items: SkyDockItem<any>[] = [];

  constructor(
    private dynamicComponentService: SkyDynamicComponentService
  ) { }

  /**
   * Docks a component to the bottom of the page.
   * @param component The component to dock.
   * @param config Options that affect the docking action.
   */
  public insertComponent<C>(
    component: Type<C>,
    providers: StaticProvider[] = [],
    config?: SkyDockItemConfig
  ): SkyDockItem<C> {

    if (!this.dockRef) {
      this.createDock();
    }

    const itemRef = this.dockRef.instance.insertComponent(component, providers, config);
    const item = new SkyDockItem(itemRef.componentRef.instance, itemRef.stackOrder);

    item.destroyed.subscribe(() => {
      this.dockRef.instance.removeItem(itemRef);
      this._items.splice(this._items.indexOf(item), 1);
      if (this._items.length === 0) {
        this.destroyDock();
      }
    });

    this._items.push(item);
    this._items.sort(sortByStackOrder);

    return item;
  }

  public insertTemplate<T>(templateRef: TemplateRef<T>, context?: T): void {
    this.dockRef.instance.insertTemplate(templateRef, context);
  }

  private createDock(): void {
    this.dockRef = this.dynamicComponentService.createComponent(SkyDockComponent);
  }

  private destroyDock(): void {
    this.dynamicComponentService.removeComponent(this.dockRef);
    this.dockRef = undefined;
  }

}
