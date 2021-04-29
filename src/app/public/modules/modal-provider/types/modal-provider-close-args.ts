/**
 * Information for what happened when the modal was closed.
 */
export interface SkyModalProviderCloseArgs {
  /**
   * The data passed from users on close or save.
   */
  data: any;

  /**
   * Indicates whether the modal was saved or closed without savings.
   */
  reason: string;
}
