import { SkyAffixPlacement } from './affix-placement';
import { SkyAffixHorizontalAlignment } from './affix-horizontal-alignment';
export interface SkyAffixPosition {
  top: number;
  left: number;
  placement: SkyAffixPlacement;
  alignment: SkyAffixHorizontalAlignment;
}
