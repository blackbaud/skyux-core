import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyViewkeeper
} from './viewkeeper';

describe('Viewkeeper', () => {
  let boundaryEl: HTMLElement;
  let el: HTMLElement;
  let scrollableParentEl: HTMLElement;
  let vks: SkyViewkeeper[];

  function scrollWindowTo(x: number, y: number) {
    window.scrollTo(x, y);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
  }

  function scrollScrollableParent(x: number, y: number) {
    scrollableParentEl.scrollTo(x, y);
    SkyAppTestUtility.fireDomEvent(scrollableParentEl, 'scroll');
  }

  function validateElStyle(
    elToValidate: HTMLElement,
    styleProperty: keyof CSSStyleDeclaration,
    expectedValue: any
  ) {
    expect(getComputedStyle(elToValidate)[styleProperty]).toBe(expectedValue);
  }

  function validatePinned(
    elToValidate: HTMLElement,
    pinned: boolean,
    pinnedTop?: number,
    marginTop = 0
  ) {
    if (pinned) {
      validateElStyle(elToValidate, 'position', 'fixed');
      validateElStyle(elToValidate, 'top', pinnedTop + 'px');
      validateElStyle(elToValidate, 'marginTop', marginTop + 'px');
    } else {
      validateElStyle(elToValidate, 'position', 'static');
      validateElStyle(elToValidate, 'top', 'auto');
    }
  }

  describe('page viewkeepers', () => {

    beforeEach(() => {
      vks = [];

      el = document.createElement('div');
      el.style.height = '30px';
      el.style.backgroundColor = 'red';

      boundaryEl = document.createElement('div');
      boundaryEl.style.marginTop = '10px';
      boundaryEl.style.width = '500px';
      boundaryEl.style.height = (window.innerHeight + 100) + 'px';

      boundaryEl.appendChild(el);

      document.body.insertBefore(boundaryEl, document.body.firstChild);
    });

    afterEach(() => {
      for (const vk of vks) {
        vk.destroy();
      }

      boundaryEl.parentElement.removeChild(boundaryEl);

      window.scrollTo(0, 0);
    });

    it('should pin an item to the top of its boundary element when scrolled out of view', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          viewportMarginTop: 5
        })
      );

      scrollWindowTo(0, 20);

      validatePinned(el, true, 0, 5);

      scrollWindowTo(0, 0);

      validatePinned(el, false);
    });

    it('should set the viewkeeper element`\s width when configured to do so', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          setWidth: true,
          viewportMarginTop: 5
        })
      );

      scrollWindowTo(0, 20);

      validatePinned(el, true, 0, 5);

      expect(getComputedStyle(el).width).toBe(getComputedStyle(boundaryEl).width);
    });

    it('should not pin an item to the top of its boundary element if it is not visible', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl
        })
      );

      el.style.display = 'none';

      scrollWindowTo(0, 20);

      validatePinned(el, false);
    });

    it('should pin an item under the specified vertical offset element', () => {
      const verticalOffsetEl = document.createElement('div');
      verticalOffsetEl.style.height = '50px';
      verticalOffsetEl.style.backgroundColor = 'blue';

      boundaryEl.insertBefore(verticalOffsetEl, el);

      vks.push(
        new SkyViewkeeper({
          el: verticalOffsetEl,
          boundaryEl
        })
      );

      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          verticalOffsetEl
        })
      );

      scrollWindowTo(0, 100);

      validatePinned(verticalOffsetEl, true, 0);
      validatePinned(el, true, 50);

      scrollWindowTo(0, 0);

      validatePinned(verticalOffsetEl, false);
      validatePinned(el, false);
    });

    it('should destroy the viewkeeper', () => {
      const vk = new SkyViewkeeper({
        el,
        boundaryEl,
        viewportMarginTop: 5
      });

      const removeEventListenerSpy = spyOn(window, 'removeEventListener').and.callThrough();

      const syncElPositionHandler = (vk as any).syncElPositionHandler;

      vk.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        syncElPositionHandler,
        true
      );

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        syncElPositionHandler
      );

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'orientationchange',
        syncElPositionHandler
      );

      expect((vk as any).el).toBeUndefined();
      expect((vk as any).boundaryEl).toBeUndefined();

      removeEventListenerSpy.calls.reset();

      vk.destroy();

      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

  });

  describe('scrollable parent viewkeepers', () => {

    beforeEach(() => {
      vks = [];

      el = document.createElement('div');
      el.style.height = '30px';
      el.style.backgroundColor = 'red';

      scrollableParentEl = document.createElement('div');
      scrollableParentEl.style.overflowY = 'scroll';
      scrollableParentEl.style.marginTop = '10px';
      scrollableParentEl.style.width = '500px';
      scrollableParentEl.style.height = (window.innerHeight + 50) + 'px';


      boundaryEl = document.createElement('div');
      boundaryEl.style.marginTop = '10px';
      boundaryEl.style.width = '500px';
      boundaryEl.style.height = (window.innerHeight + 100) + 'px';

      scrollableParentEl.appendChild(boundaryEl);
      boundaryEl.appendChild(el);

      document.body.insertBefore(scrollableParentEl, document.body.firstChild);
    });

    afterEach(() => {
      for (const vk of vks) {
        vk.destroy();
      }

      boundaryEl.parentElement.removeChild(boundaryEl);

      window.scrollTo(0, 0);
    });

    it('should pin an item to the top of its boundary element when scrolled out of view', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          scrollableParent: scrollableParentEl,
          viewportMarginTop: 5
        })
      );

      scrollScrollableParent(0, 20);

      validatePinned(el, true, 10, 5);

      // Validate that window scroll moves the pinned viewkeeper once it is pinned
      scrollWindowTo(0, 10);

      validatePinned(el, true, 0, 5);

      scrollWindowTo(0, 0);

      validatePinned(el, true, 10, 5);

      scrollScrollableParent(0, 0);

      validatePinned(el, false);
    });

    it('should set the viewkeeper element`\s width when configured to do so', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          setWidth: true,
          scrollableParent: scrollableParentEl,
          viewportMarginTop: 5
        })
      );

      scrollScrollableParent(0, 20);

      validatePinned(el, true, 10, 5);

      expect(getComputedStyle(el).width).toBe(getComputedStyle(boundaryEl).width);
    });

    it('should not pin an item to the top of its boundary element if it is not visible', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          scrollableParent: scrollableParentEl
        })
      );

      el.style.display = 'none';

      scrollScrollableParent(0, 20);

      validatePinned(el, false);
    });

    it('should pin an item under the specified vertical offset element', () => {
      const verticalOffsetEl = document.createElement('div');
      verticalOffsetEl.style.height = '50px';
      verticalOffsetEl.style.backgroundColor = 'blue';

      boundaryEl.insertBefore(verticalOffsetEl, el);

      vks.push(
        new SkyViewkeeper({
          el: verticalOffsetEl,
          boundaryEl,
          scrollableParent: scrollableParentEl
        })
      );

      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          verticalOffsetEl,
          scrollableParent: scrollableParentEl
        })
      );

      scrollScrollableParent(0, 100);

      validatePinned(verticalOffsetEl, true, 10);
      validatePinned(el, true, 60);

      scrollScrollableParent(0, 0);

      validatePinned(verticalOffsetEl, false);
      validatePinned(el, false);
    });

    it('should destroy the viewkeeper', () => {
      const vk = new SkyViewkeeper({
        el,
        boundaryEl,
        scrollableParent: scrollableParentEl,
        viewportMarginTop: 5
      });

      const removeEventListenerSpy = spyOn(window, 'removeEventListener').and.callThrough();

      const syncElPositionHandler = (vk as any).syncElPositionHandler;

      vk.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        syncElPositionHandler,
        true
      );

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        syncElPositionHandler
      );

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'orientationchange',
        syncElPositionHandler
      );

      expect((vk as any).el).toBeUndefined();
      expect((vk as any).boundaryEl).toBeUndefined();

      removeEventListenerSpy.calls.reset();

      vk.destroy();

      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

  });

});
