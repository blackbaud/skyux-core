// #region imports
import {
  SkyAppWindowRef
} from './window-ref';
// #endregion

describe('Window ref', () => {
  it('should provide a way to access the native window object', () => {
    const ref = new SkyAppWindowRef();

    expect(ref.nativeWindow).toBe(window);
  });
});
