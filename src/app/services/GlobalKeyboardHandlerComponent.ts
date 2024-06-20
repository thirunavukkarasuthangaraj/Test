import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'disableEscape',
  template: '',
  styles: []
})
export class GlobalKeyboardHandlerComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.isJoyrideActive()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private isJoyrideActive(): boolean {
    // You need to implement a way to determine if the Joyride tour is active.
    // This could be by checking a shared service or a global variable.
    return document.body.classList.contains('joyride-active');
  }
}
