import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-skeleton',
  templateUrl: './common-skeleton.component.html',
  styleUrls: ['./common-skeleton.component.scss']
})
export class CommonSkeletonComponent implements OnInit {
  @Input() NameOftheScreen: string;
  @Input() countforView: number = 4;

  constructor() { }

  ngOnInit() {

   }
   getRows(): number[] {
    const totalCards = Math.ceil(this.countforView / 3); // Assuming countforView is the total number of cards
    return Array(totalCards).fill(0).map((x, i) => i);
  }


}
