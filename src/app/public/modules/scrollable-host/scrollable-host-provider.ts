import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class SkyScrollableHostProvider {
  public scrollableElementRef$: Observable<ElementRef>;
}
