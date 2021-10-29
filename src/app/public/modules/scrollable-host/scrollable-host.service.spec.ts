import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyScrollableHostService } from './scrollable-host.service';
import { ScrollableHostFixtureComponent } from './fixtures/scrollable-host.component.fixture';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SkyScrollableHostModule } from './scrollable-host.module';

describe('Scrollable host service', () => {

  let cmp: ScrollableHostFixtureComponent;
  let fixture: ComponentFixture<ScrollableHostFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScrollableHostFixtureComponent
      ],
      imports: [
        SkyScrollableHostModule
      ]
    });

    fixture = TestBed.createComponent(ScrollableHostFixtureComponent);
    cmp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return the current scrollable parent', () => {
    const scrollableHostService = TestBed.inject(SkyScrollableHostService);

    expect(scrollableHostService.getScrollabeHost(cmp.target)).toBe(cmp.parent.nativeElement);
  });

  it('should return the window if no scrollable parent', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    const scrollableHostService = TestBed.inject(SkyScrollableHostService);

    expect(scrollableHostService.getScrollabeHost(cmp.target)).toBe(window);
  });

  // Sanity check
  it('should return the window if the element ref returns no native element', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    const scrollableHostService = TestBed.inject(SkyScrollableHostService);

    expect(scrollableHostService.getScrollabeHost({ nativeElement: undefined })).toBe(window);
  });

  // Sanity check
  it('should return the window if the element is not scrollable and the parent is not an element', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    const scrollableHostService = TestBed.inject(SkyScrollableHostService);
    spyOnProperty(cmp.target.nativeElement, 'parentNode', 'get').and.returnValue(undefined);

    expect(scrollableHostService.getScrollabeHost(cmp.target)).toBe(window);
  });


  it('should return an observable with the initial value of the current scrollable parent', async () => {
    const completionObservable = new Subject<void>();
    const scrollableHostService = TestBed.inject(SkyScrollableHostService);

    const scrollableHostObservable = scrollableHostService.watchScrollableHost(cmp.target, completionObservable);

    scrollableHostObservable.pipe(take(1)).subscribe((scrollableHost) => {
      expect(scrollableHost).toBe(cmp.parent.nativeElement);
      completionObservable.next();
    });
  });

  // Using `done` here as with just `async` the test runner is moving the content when it shouldn't
  // which causes issues with finding the parent correctly.
  it('should update observable with new scrollable parent when it changes', (done) => {
    let obserableCount = 0;
    const completionObservable = new Subject<void>();
    const scrollableHostService = TestBed.inject(SkyScrollableHostService);

    const scrollableHostObservable = scrollableHostService.watchScrollableHost(cmp.target, completionObservable);

    scrollableHostObservable.pipe(take(2)).subscribe((scrollableHost) => {
      if (obserableCount === 0) {
        expect(scrollableHost).toBe(cmp.parent.nativeElement);
        cmp.isParentScrollable = false;
        obserableCount++;
        fixture.detectChanges();
      } else {
        expect(scrollableHost).toBe(window);
        completionObservable.next();
        done();
      }
    });
  });
});
