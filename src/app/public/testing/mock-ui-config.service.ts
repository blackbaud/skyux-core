import {
  Injectable
} from '@angular/core';

import {
  of as observableOf
} from 'rxjs';

import {
  SkyUIConfigService
} from '../modules/ui-config/ui-config.service';

@Injectable()
export class MockSkyUIConfigService extends SkyUIConfigService {

  public getConfig(
    key: string,
    defaultConfig?: any
  ): any {
    switch (key) {
      case 'defaultSettings':
        return observableOf(defaultConfig);
      case 'badData':
        return observableOf({invalidProperty: 'invalidData'});
      default: {
        return observableOf({
          settings: {
            userSettings: {
              singleColumn: {
                tiles: [
                  {
                    id: 'tile-1',
                    isCollapsed: true
                  },
                  {
                    id: 'tile-2',
                    isCollapsed: true
                  }
                ]
              },
              multiColumn: [
                {
                  tiles: [
                    {
                      id: 'tile-2',
                      isCollapsed: true
                    }
                  ]
                },
                {
                  tiles: [
                    {
                      id: 'tile-1',
                      isCollapsed: true
                    }
                  ]
                }
              ]
            },
            defaultSettings: [
              'tile-1',
              'tile-2'
            ]
          }
        });
      }
    }
  }
}
