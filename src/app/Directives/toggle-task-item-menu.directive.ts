import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appToggleTaskItemMenu]'
})
export class ToggleTaskItemMenuDirective {

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }
  @HostListener('mouseover') onMouseOver(): void {
    this.renderer.addClass(this.el.nativeElement, 'show');
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.renderer.removeClass(this.el.nativeElement, 'show');
  }

}
