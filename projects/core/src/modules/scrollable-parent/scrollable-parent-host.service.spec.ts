import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SkyScrollableParentHostService } from "./scrollable-parent-host.service";
import { ScrollableParentHostFixtureComponent } from "./fixtures/scrollable-parent-host.component.fixture";
import { take } from "rxjs/operators";
import { Subject } from "rxjs";

describe('Scrollable host service', () => {

  let cmp: ScrollableParentHostFixtureComponent;
  let fixture: ComponentFixture<ScrollableParentHostFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScrollableParentHostFixtureComponent
      ]
    });

    fixture = TestBed.createComponent(ScrollableParentHostFixtureComponent);
    cmp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return the current scrollable parent', () => {
    const scrollableHostService = TestBed.inject(SkyScrollableParentHostService);

    expect(scrollableHostService.getScrollabeParent(cmp.target)).toBe(cmp.parent.nativeElement);
  });

  it('should return the window if no scrollable parent', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    const scrollableHostService = TestBed.inject(SkyScrollableParentHostService);

    expect(scrollableHostService.getScrollabeParent(cmp.target)).toBe(window);
  });

  it('should return an observable with the initial value of the current scrollable parent', async () => {
    const completionObservable = new Subject<void>();
    const scrollableHostService = TestBed.inject(SkyScrollableParentHostService);

    const scrollableParentObservable = scrollableHostService.watchScrollableParent(cmp.target, completionObservable);

    scrollableParentObservable.pipe(take(1)).subscribe((scrollableParent) => {
      expect(scrollableParent).toBe(cmp.parent.nativeElement);
      completionObservable.next();
    });
  });

  // Using `done` here as with just `async` the test runner is moving the content when it shouldn't
  // which causes issues with finding the parent correctly.
  it('should update observable with new scrollable parent when it changes', (done) => {
    let obserableCount = 0;
    const completionObservable = new Subject<void>();
    const scrollableHostService = TestBed.inject(SkyScrollableParentHostService);

    const scrollableParentObservable = scrollableHostService.watchScrollableParent(cmp.target, completionObservable);

    scrollableParentObservable.pipe(take(2)).subscribe((scrollableParent) => {
      if (obserableCount === 0) {
        expect(scrollableParent).toBe(cmp.parent.nativeElement);
        cmp.isParentScrollable = false;
        obserableCount++;
        fixture.detectChanges();
      } else {
        expect(scrollableParent).toBe(window);
        completionObservable.next();
        done();
      }
    });
  });
});
