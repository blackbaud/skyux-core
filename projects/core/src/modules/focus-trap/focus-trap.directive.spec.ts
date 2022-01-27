import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { FocusTrapDirectiveFixtureComponent } from './fixtures/focus-trap.directive.fixture';

import { SkyFocusTrapModule } from './focus-trap.module';

describe('Focus trap directive', () => {
  let fixture: ComponentFixture<FocusTrapDirectiveFixtureComponent>;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyFocusTrapModule],
      declarations: [FocusTrapDirectiveFixtureComponent],
    });

    fixture = TestBed.createComponent(FocusTrapDirectiveFixtureComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should allow tabbing between elements when they are not in the focus trap', () => {
    let button1: HTMLElement = el.querySelector('#button-1');
    let button2: HTMLElement = el.querySelector('#button-2');

    let preventSpy = spyOn(Event.prototype, 'preventDefault').and.callThrough();
    let propogationSpy = spyOn(
      Event.prototype,
      'stopPropagation'
    ).and.callThrough();

    button1.focus();
    SkyAppTestUtility.fireDomEvent(button1, 'keydown', {
      bubbles: true,
      cancelable: true,
      keyboardEventInit: {
        key: 'Tab',
        shiftKey: true,
      },
    });

    //NOTE: Jasmine can not actually move foucs on tab events when they utilize the native behavior
    // this is testing to make sure we don't move focus via the directive
    expect(document.activeElement).toBe(button1);

    expect(preventSpy).not.toHaveBeenCalled();
    expect(propogationSpy).not.toHaveBeenCalled();

    button2.focus();
    SkyAppTestUtility.fireDomEvent(button2, 'keydown', {
      bubbles: true,
      cancelable: true,
      keyboardEventInit: {
        key: 'Tab',
      },
    });

    //NOTE: Jasmine can not actually move foucs on tab events when they utilize the native behavior
    // this is testing to make sure we don't move focus via the directive
    expect(document.activeElement).toBe(button2);

    expect(preventSpy).not.toHaveBeenCalled();
    expect(propogationSpy).not.toHaveBeenCalled();
  });

  it('should wrap focus correctly when tabbing inside the focus trap', () => {
    let trappedButton1: HTMLElement = el.querySelector('#trapped-button-1');
    let trappedButton2: HTMLElement = el.querySelector('#trapped-button-2');
    let trappedButton3: HTMLElement = el.querySelector('#trapped-button-3');

    let preventSpy = spyOn(Event.prototype, 'preventDefault').and.callThrough();
    let propogationSpy = spyOn(
      Event.prototype,
      'stopPropagation'
    ).and.callThrough();

    // Test that a middle button works as normal

    trappedButton2.focus();
    SkyAppTestUtility.fireDomEvent(trappedButton2, 'keydown', {
      bubbles: true,
      cancelable: true,
      keyboardEventInit: {
        key: 'Tab',
      },
    });

    //NOTE: Jasmine can not actually move foucs on tab events when they utilize the native behavior
    // this is testing to make sure we don't move focus via the directive.
    expect(document.activeElement).toBe(trappedButton2);

    expect(preventSpy).not.toHaveBeenCalled();
    expect(propogationSpy).not.toHaveBeenCalled();

    trappedButton1.focus();
    SkyAppTestUtility.fireDomEvent(trappedButton1, 'keydown', {
      bubbles: true,
      cancelable: true,
      keyboardEventInit: {
        key: 'Tab',
        shiftKey: true,
      },
    });

    expect(document.activeElement).toBe(trappedButton3);

    expect(preventSpy).toHaveBeenCalled();
    expect(propogationSpy).toHaveBeenCalled();

    trappedButton3.focus();
    SkyAppTestUtility.fireDomEvent(trappedButton3, 'keydown', {
      bubbles: true,
      cancelable: true,
      keyboardEventInit: {
        key: 'Tab',
      },
    });

    expect(document.activeElement).toBe(trappedButton1);

    expect(preventSpy).toHaveBeenCalled();
    expect(propogationSpy).toHaveBeenCalled();
  });

  it('should return focus to the element that had focus when the focus trap was created when the trap is destroyed', () => {
    fixture.componentInstance.hideFocusTrap = true;

    fixture.detectChanges();

    let button1: HTMLElement = el.querySelector('#button-1');
    button1.focus();

    expect(document.activeElement).toBe(button1);

    fixture.detectChanges();
    fixture.componentInstance.hideFocusTrap = false;
    fixture.detectChanges();

    let trappedButton1: HTMLElement = el.querySelector('#trapped-button-1');
    trappedButton1.focus();

    expect(document.activeElement).toBe(trappedButton1);

    fixture.detectChanges();
    fixture.componentInstance.hideFocusTrap = true;
    fixture.detectChanges();

    expect(document.activeElement).toBe(button1);
  });

  it('should not react to a key other than Tab - sanity check', () => {
    let trappedButton1: HTMLElement = el.querySelector('#trapped-button-1');
    let trappedButton2: HTMLElement = el.querySelector('#trapped-button-2');
    let trappedButton3: HTMLElement = el.querySelector('#trapped-button-3');

    let preventSpy = spyOn(Event.prototype, 'preventDefault').and.callThrough();
    let propogationSpy = spyOn(
      Event.prototype,
      'stopPropagation'
    ).and.callThrough();

    // Test that a middle button works as normal

    trappedButton2.focus();
    SkyAppTestUtility.fireDomEvent(trappedButton2, 'keydown', {
      bubbles: true,
      cancelable: true,
      keyboardEventInit: {
        key: 'B',
      },
    });

    expect(preventSpy).not.toHaveBeenCalled();
    expect(propogationSpy).not.toHaveBeenCalled();
  });
});
