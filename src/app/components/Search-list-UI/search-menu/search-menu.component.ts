import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.scss']
})
export class SearchMenuComponent implements OnInit {

  @Output() menuSelected  = new EventEmitter<string>();

  selectMenu: string;

  constructor(private aroute: ActivatedRoute) {
    // if (menu === undefined || menu != null || menu !== '') {
      // this.menuSelected.emit(this.selectMenu)

    // }
  }

  ngOnInit() {
    let menu = this.aroute.snapshot.queryParamMap.get('data');

    this.selectMenu = menu;


  }

  onSelect(featuer){

    this.menuSelected.emit(featuer);
    this.selectMenu = featuer;
  }
}
