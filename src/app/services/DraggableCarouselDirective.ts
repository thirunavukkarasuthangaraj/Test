import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import * as Hammer from 'hammerjs';

@Directive({
  selector: '[draggableCarousel]'
})
export class DraggableCarouselDirective implements AfterViewInit {
  private carouselElement: HTMLElement;
  private initialTransform: number = 0;

  constructor(private el: ElementRef) {
    this.carouselElement = el.nativeElement.querySelector('.carousel-inner');
  }

  ngAfterViewInit() {

    if (this.carouselElement) {


      const hammer = new Hammer(this.carouselElement);
      hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

      let lastDeltaX = 0; // Track the last delta X value

      hammer.on('panstart', (e) => {
        // Reset lastDeltaX at the start of a new pan
        lastDeltaX = 0;
      });

      hammer.on('panmove', (e) => {
        requestAnimationFrame(() => {
          // Calculate the new transform value based on the cumulative delta
          const deltaX = e.deltaX - lastDeltaX;
          const newTransform = this.initialTransform + deltaX;
          this.carouselElement.style.transform = `translateX(${newTransform}px)`;

          // Update lastDeltaX and initialTransform for smooth, continuous tracking
          lastDeltaX = e.deltaX;
          this.initialTransform = newTransform;
        });
      });

      hammer.on('panend', (e) => {
        // Handle the end of the pan gesture (e.g., snap to the nearest slide)
        // You might adjust initialTransform here based on final slide position
      });

    }



}

}
