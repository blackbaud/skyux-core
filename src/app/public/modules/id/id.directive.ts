import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2
} from '@angular/core';

let idIndex = 0;

function generateId(): string {
  return '__sky-id-gen-' + ++idIndex;
}

@Directive({
  selector: '[skyId]',
  exportAs: 'skyId'
})
export class SkyIdDirective implements OnInit {

  public get id(): string {
    return this._id;
  }

  private _id: string;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }

  public ngOnInit(): void {
    const id = generateId();

    this.renderer.setAttribute(
      this.elRef.nativeElement,
      'id',
      id
    );

    this._id = id;
  }

}
