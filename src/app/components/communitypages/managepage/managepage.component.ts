import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-managepage',
  templateUrl: './managepage.component.html',
  styleUrls: ['./managepage.component.scss']
})
export class ManagepageComponent implements OnInit {

  @Input() commonemit
  
  constructor() { }

  ngOnInit() {
  }

}
