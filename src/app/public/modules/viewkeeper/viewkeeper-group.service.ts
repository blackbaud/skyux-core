import {
  Injectable
} from '@angular/core';

import {
  Observable,
  Subject
} from 'rxjs';

@Injectable()
export class SkyViewkeeperGroupService {

  public groupName: string;

  public readonly viewkeeperElsChange: Observable<any>;

  private viewkeeperElsChangeSub: Subject<any>;

  private viewkeeperMap: { [key: string]: HTMLElement[] } = {};

  constructor() {
    this.viewkeeperElsChangeSub = new Subject<any>();
    this.viewkeeperElsChange = this.viewkeeperElsChangeSub.asObservable();
  }

  public setViewkeeperEls(viewkeeperId: string, els: HTMLElement[]): void {
    this.viewkeeperMap[viewkeeperId] = els;

    this.viewkeeperElsChangeSub.next();
  }

  public getGroupViewkeeperEls(): HTMLElement[] {
    let els: HTMLElement[] = [];

    for (const key of Object.keys(this.viewkeeperMap)) {
      els = els.concat(this.viewkeeperMap[key]);
    }

    els.sort((el1, el2) => {
      const result = el1.compareDocumentPosition(el2);

      if (
        // tslint:disable-next-line: no-bitwise
        result & Node.DOCUMENT_POSITION_CONTAINS || result & Node.DOCUMENT_POSITION_PRECEDING
      ) {
        return 1;
      }

      return -1;
    });

    return els;
  }

  public destroy(): void {
    this.viewkeeperMap = undefined;
  }

}
