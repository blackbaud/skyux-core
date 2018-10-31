// #region imports
import {
  SkyLibResourcesProvider
} from '@skyux/i18n/modules/i18n/lib-resources-provider';

import {
  SkyAppLocaleInfo
} from '@skyux/i18n/modules/i18n/locale-info';
// #endregion

export class SkyCoreResourcesProvider implements SkyLibResourcesProvider {
  public getString: (localeInfo: SkyAppLocaleInfo, name: string) => string;
}
