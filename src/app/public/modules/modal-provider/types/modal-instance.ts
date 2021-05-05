import {
  Observable
} from 'rxjs';

import {
  SkyCoreModalBeforeCloseHandler
} from './modal-before-close-handler';

import {
  SkyCoreModalCloseArgs
} from './modal-close-args';

/**
 * A instance of a modal provided through a modal provider.
 */
export interface SkyCoreModalInstance {

  /**
   * A direct reference to the provided component's class.
   */
  componentInstance: any;

  /**
   * An event that the modal instance emits when it is about to close.
   */
  beforeClose: Observable<SkyCoreModalBeforeCloseHandler>;

  /**
   * An event that the modal instance emits when it closes.
   */
  closed: Observable<SkyCoreModalCloseArgs>;

  /**
   * Closes the modal instance.
   * @param result Specifies an object to emit to subscribers of the `closed` event of the
   * modal instance. The `SkyCoreModalInstance` provider can be injected into a component's constructor
   * so that this `close` function can be called from a button in the `sky-modal-footer`.
   * @param reason Specifies the reason for the modal closing, with the default reason of `close`.
   * @param ignoreBeforeClose Indicates whether to ignore the modal instance's `beforeClose` event.
   */
  close(result?: any, reason?: string, ignoreBeforeClose?: boolean): void;

  /**
   * Closes the modal instance with `reason=cancel`.
   * @param result Specifies an object to emit to subscribers of the `closed` event of the modal
   * instance. The `SkyCoreModalInstance` provider can be injected into a component's constructor so
   * that this cancel function can be called from a button in the `sky-modal-footer`.
   */
  cancel(result?: any): void;

  /**
   * Closes the modal instance with `reason=save`.
   * @param result Specifies an object to emit to subscribers of the `closed` event of the modal
   * instance. The `SkyCoreModalInstance` provider can be injected into a component's constructor so
   * that this `save` function can be called from a button in `the sky-modal-footer`.
   */
  save(result?: any): void;
}
