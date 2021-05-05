import {
  SkyCoreModalCloseArgs
} from './modal-close-args';

/**
 * Handler for things that need to occur prior to a modal closes.
 */
export class SkyCoreModalBeforeCloseHandler {
  constructor(
    public readonly closeModal: Function,
    public readonly closeArgs: SkyCoreModalCloseArgs
  ) { }
}
