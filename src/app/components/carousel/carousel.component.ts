import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Image } from 'src/app/services/imageService';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('slide-in', [
      state('left', style({
        // opacity: 0,
        // transform: 'translateX(-100%)'
      })),
      state('middle', style({
        // opacity: 1,
        // transform: 'translateX(0)'
      })),
      state('right', style({
        // opacity: 0,
        // transform: 'translateX(100%)'
      })),
      transition('left=>middle', [
        style({
          // opacity: 0,
          // transform: 'translateX(100%)'
        }),
        // animate('400ms')
      ]),
      transition('right=>middle', [
        style({
          // opacity: 0,
          // transform: 'translateX(-100%)'
        }),
        // animate('400ms')
      ]),
      transition('middle=>*', [
        // animate('400ms')
      ])
    ])
  ]
})
export class CarouselComponent implements OnInit {
  @Input() selectedImage1: number;
  @Input() images: Array<Image>;
  @Output() closeCarousel = new EventEmitter<void>();
  public animState = 'middle'
  public animImage: number
  constructor() {
   }

  ngOnInit() {
    this.animImage = this.selectedImage1
  }

  public close(): void {
    this.closeCarousel.emit()
  }

  public previous(): void {
    this.animState = 'left'
    this.selectedImage1 = this.selectedImage1 > 0 ? this.selectedImage1 - 1  : this.images.length - 1;
    this.blur()
  }

  private blur() {
    const activeElement = document.activeElement as HTMLElement;
    if(activeElement !== null) {
      activeElement.blur()
    }
  }

  public animDone(): void {
    this.animImage = this.selectedImage1;
    this.animState = 'middle';

  }

  public next(value): void {
    // console.log(value)
    this.animState = 'right'
    this.selectedImage1 = this.selectedImage1 < this.images.length - 1 ? this.selectedImage1 + 1 : 0;
    this.blur()
  }

  public onEvent(event: Event): void {
    event.stopPropagation()
  }

}
