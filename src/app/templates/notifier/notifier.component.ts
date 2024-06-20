import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.scss']
})
export class NotifierComponent implements OnInit, OnChanges {

  constructor(private router: Router) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.executeShow.currentValue == true) {
      this.show();
    }
  }
  @Input() executeShow: boolean;
  @Input() message: string;
  @Input() title: string;
  @Input() buttonName: string;
  isVisible: boolean = false;

  show(): void {
    this.isVisible = true;
  }

  hide(): void {
    this.isVisible = false;
  }

  routeTo() {
    const userId: string = localStorage.getItem("userId");
    this.router.navigate(["/personalProfile"], { queryParams: { 'userId': userId, 'highlightSecondaryEmail': true } });

  }

}
